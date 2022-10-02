import {
  Box,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import {
  addDays,
  endOfMonth,
  isSameDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { LoggedOut } from "../../components/LoggedOut";
import { OverviewChart } from "../../components/OverviewChart";
import { prisma } from "../server/db/client";
import { Spacer } from "../../components/lib/Spacer";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Loader } from "../../components/lib/Loader";
import { WorkoutView } from "../../components/WorkoutView";
import { useRouter } from "next/router";
import { Wrapper } from "../../components/lib/Wrapper";
import { TotalScore } from "../../components/TotalScore";

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
  workoutChartData: {
    x: number;
    y: number;
  }[][];
  lastFive: (Workout & {
    WorkoutType: WorkoutType | null;
    User: User | null;
  })[];
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

  const currentUserWorkouts = await prisma.workout.findMany({
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

  const allWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      User: true,
      WorkoutType: true,
    },
  });

  const lastFive = allWorkouts.reverse().slice(0, 3);

  const workoutDict = allWorkouts.reduce(
    (sum: { [id: string]: Workout[] }, workout) => {
      if (!workout.userId) {
        throw Error("Could not find user");
      }
      if (sum[workout.userId] === undefined) {
        sum[workout.userId] = [];
      }
      sum[workout.userId]?.push(workout);
      return sum;
    },
    {}
  );

  const users = Object.keys(workoutDict);

  const workoutChartData = users.map((user) => {
    const result = daysInMonth.map((dayNumber) => {
      let score = 0;
      const day = new Date();
      day.setDate(dayNumber);

      workoutDict[user]?.filter((workout) => {
        if (isSameDay(workout.date, day)) {
          score += workout.points;
        }
      });
      return {
        x: dayNumber,
        y: score,
      };
    });
    return result;
  });

  const totalScoresMap = allWorkouts.reduce((sum: UserWorkoutMap, workout) => {
    sum[workout.User?.name ?? ""] =
      (sum[workout.User?.name ?? ""] ?? 0) + workout.points;
    return sum;
  }, {});

  const todaysWorkout = currentUserWorkouts.find((el) => isToday(el.date));

  const totalScores = Object.keys(totalScoresMap)
    .map((key) => ({
      name: key,
      totalScore: totalScoresMap[key] ?? 0,
    }))
    .sort((k, p) => (p.totalScore > k.totalScore ? 1 : -1));

  return {
    props: {
      workoutTypes,
      totalScores,
      daysInMonth,
      workoutChartData,
      hasWorkedOutToday: !!todaysWorkout,
      lastFive,
    },
  };
};

const Home: NextPage<Props> = ({
  workoutTypes,
  totalScores,
  daysInMonth,
  workoutChartData,
  hasWorkedOutToday,
  lastFive,
}) => {
  const router = useRouter();
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
      <Wrapper>
        <Heading mb="5" size="lg">
          Treningsutfordring
        </Heading>

        {router.query.action === "addworkoutsuccess" ? (
          <>
            <Spacer />
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Trening lagret</AlertTitle>
              <AlertDescription>Godt jobbet!!!</AlertDescription>
            </Alert>
            <Spacer />
          </>
        ) : null}

        {!hasWorkedOutToday ? (
          <Box bgColor="khaki" padding="5" color="black" mb="5">
            Du har ikke samlet noen poeng i dag. På tide å komme seg opp på
            hesten!
          </Box>
        ) : null}

        <TotalScore totalScores={totalScores} />

        <Spacer />
        <Box>
          <Heading size="md" mb="5">
            Siste treninger
          </Heading>
          <Flex textAlign="left" flexDirection="column" gap="2">
            {lastFive.map((workout) => {
              return (
                <WorkoutView key={workout.id} workout={workout}></WorkoutView>
              );
            })}
          </Flex>
        </Box>

        <Spacer />
        <OverviewChart data={workoutChartData} daysInMonth={daysInMonth} />

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
      </Wrapper>
    </>
  );
};

export default Home;
