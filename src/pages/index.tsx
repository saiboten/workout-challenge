import { Box, Button, Heading, List, ListItem, Stack } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import type { NextPage } from "next";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { LoggedOut } from "../../components/LoggedOut";
import { OverviewChart } from "../../components/OverviewChart";
import { prisma } from "../server/db/client";
import { trpc } from "../utils/trpc";

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

interface Props {
  workoutTypes: WorkoutType[];
  totalScores: {
    name: string | null;
    totalScore: number;
  }[];
  thisMonthMap: { [id: string]: number };
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  const workoutTypes = await prisma.workoutType.findMany();

  const users = await prisma.user.findMany({
    include: {
      workouts: true,
    },
  });

  const thisMonthsWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
    include: {
      User: true,
    },
  });

  const thisMonthMap = thisMonthsWorkouts.reduce(
    (s: { [id: string]: number }, n) => {
      if (!n.User?.name) {
        throw new Error("Found not find user");
      }

      const existing = s[n.User.name] ?? 0;
      s[n.User.name] = existing + n.points;

      return s;
    },
    {}
  );

  const totalScores = users.map((user) => {
    const totalScore = user.workouts.reduce((sum, next) => {
      return sum + next.points;
    }, 0);

    return {
      totalScore,
      name: user.name,
      thisMonthMap,
    };
  });

  return {
    props: {
      workoutTypes,
      totalScores,
      thisMonthMap,
    },
  };
}

const Home: NextPage<Props> = ({ workoutTypes, totalScores, thisMonthMap }) => {
  // const { data } = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  console.log(thisMonthMap);

  const session = useSession();

  if (!session.data?.user) {
    return <LoggedOut />;
  }

  const data2 = [
    { month: 1, points: 100 },
    { month: 2, points: 250 },
    { month: 3, points: 280 },
  ] as const;

  return (
    <>
      <Head>
        <title>Workout Challenge</title>
        <meta name="description" content="Workout Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContainerOuter>
        <ContainerInner>
          <Heading mb="5" size="lg">
            Workout Challenge
          </Heading>

          <Heading size="md">Velg treningstype</Heading>
          <Box p="5" borderRadius="10px" border="1px solid black" m="5">
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

          <OverviewChart data={data2} />

          <List>
            {totalScores.map((el) => {
              return (
                <ListItem key={el.name ?? "-"}>
                  {el.name} - {el.totalScore}
                </ListItem>
              );
            })}
          </List>

          <button onClick={() => signOut()}>Logg ut</button>
        </ContainerInner>
      </ContainerOuter>
    </>
  );
};

export default Home;
