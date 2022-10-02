import {
  Box,
  Button,
  Heading,
  List,
  UnorderedList,
  ListItem,
  Stack,
} from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import {
  addDays,
  addMonths,
  endOfMonth,
  isSameDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { useSession, signOut, getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { LoggedOut } from "../../components/LoggedOut";
import { OverviewChart } from "../../components/OverviewChart";
import { prisma } from "../server/db/client";
import { trpc } from "../utils/trpc";
import { Spacer } from "../../components/lib/Spacer";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Loader } from "../../components/lib/Loader";
import { number } from "zod";

const ContainerOuter = styled.div`
  --color-gray-500: rgba(107, 114, 128, 100%);
  --color-gray-600: rgba(75, 85, 99, 100%);
  --color-gray-700: rgba(55, 65, 81, 100%);
  --color-purple-300: rgba(216, 180, 254, 100%);
  --color-blue-500: rgba(59, 130, 246, 100%);
  --color-violet-500: rgba(139, 92, 246, 100%);
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
`;

const ContainerInner = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

interface UserWorkoutMap {
  [id: string]: number;
}

interface Props {
  workoutTypes: WorkoutType[];
  totalScores: {
    name: string | null;
    totalScore: number;
  }[];
  daysInMonth: number[];
  hasWorkedOutToday: boolean;
  monthChartData: {
    x: number;
    y: number;
  }[];
}

const getDaysInMonth = (monthStart: Date, monthEnd: Date): number[] => {
  const returnList = [];
  let currentDate = monthStart;

  while (currentDate < monthEnd) {
    returnList.push(currentDate.getDate());
    currentDate = addDays(currentDate, 1);
  }

  return returnList;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const workoutTypes = await prisma.workoutType.findMany();

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const daysInMonth = getDaysInMonth(monthStart, monthEnd);

  const thisMonthsWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
      userId: session?.user?.id,
    },
    include: {
      User: true,
    },
  });

  const result = daysInMonth.map((el) => {
    let score = 0;
    const day = new Date();
    day.setDate(el);

    thisMonthsWorkouts.filter((workout) => {
      if (isSameDay(workout.date, day)) {
        score += workout.points;
      }
    });
    return {
      x: el,
      y: score,
    };
  });

  const totalScoresMap = thisMonthsWorkouts.reduce(
    (sum: UserWorkoutMap, workout) => {
      sum[workout.User?.name ?? ""] =
        (sum[workout.User?.name ?? ""] ?? 0) + workout.points;
      return sum;
    },
    {}
  );

  const todaysWorkout = thisMonthsWorkouts.find((el) => isToday(el.date));

  const totalScores = Object.keys(totalScoresMap).map((key) => ({
    name: key,
    totalScore: totalScoresMap[key] ?? 0,
  }));

  return {
    props: {
      workoutTypes,
      totalScores,
      daysInMonth,
      monthChartData: result,
      hasWorkedOutToday: !!todaysWorkout,
    },
  };
};

const Home: NextPage<Props> = ({
  workoutTypes,
  totalScores,
  daysInMonth,
  monthChartData,
  hasWorkedOutToday,
}) => {
  // const { data } = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  const session = useSession();

  if (session.status == "loading") {
    return <Loader />;
  }

  if (session.status == "unauthenticated") {
    return <LoggedOut />;
  }

  return (
    <>
      <Head>
        <title>Treningsutfordring</title>
        <meta name="description" content="Workout Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContainerOuter>
        <ContainerInner>
          <Heading mb="5" size="lg">
            Treningsutfordring
          </Heading>

          {!hasWorkedOutToday ? (
            <Box bgColor="khaki" padding="5" color="black" mb="5">
              Du har ikke samling noen poeng i dag. På tide å komme seg opp på
              hesten!
            </Box>
          ) : null}

          <Box textAlign="left">
            <UnorderedList>
              {totalScores.map((el) => {
                return (
                  <ListItem key={el.name ?? "-"}>
                    {el.name} - {el.totalScore}
                  </ListItem>
                );
              })}
            </UnorderedList>
          </Box>
          <Spacer />
          <OverviewChart data={monthChartData} daysInMonth={daysInMonth} />

          <Box
            p="5"
            borderRadius="10px"
            border="1px solid black"
            m="5"
            minWidth="100%"
          >
            <Heading size="md">Legg til trening</Heading>
            <Spacer />
            <Stack
              direction={{ base: "column", md: "row" }}
              align="center"
              maxWidth="800px"
              flexWrap="wrap"
              gap="2"
            >
              {workoutTypes.map((workout) => {
                return (
                  <>
                    <Link key={workout.id} href={`/create/${workout.id}`}>
                      <Button colorScheme="teal">{workout.name}</Button>
                    </Link>
                  </>
                );
              })}
            </Stack>
          </Box>

          <Link href="workouts">
            <Button colorScheme="teal">Se treninger</Button>
          </Link>

          <Spacer />

          <Button onClick={() => signOut()}>Logg ut</Button>
        </ContainerInner>
      </ContainerOuter>
    </>
  );
};

export default Home;
