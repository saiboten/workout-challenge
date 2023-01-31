import {
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  propNames,
  Text,
} from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import {
  addDays,
  addMonths,
  endOfMonth,
  isBefore,
  isSameDay,
  isToday,
  setDate,
  startOfMonth,
  subMonths,
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
import { useRouter } from "next/router";
import { TotalScore } from "../../components/TotalScore";
import { useEffect } from "react";
import { WorkoutNewsFeed } from "../../components/WorkoutNewsFeed";
import { AddWorkoutLinks } from "../../components/AddWorkoutLinks";
import { ProgressLineChart } from "../../components/ProgressLineChart";
import { trpc } from "../utils/trpc";
import { Sum } from "../../components/Sum";

interface UserWorkoutMap {
  [id: string]: number;
}

interface Props {
  today: Date;
  totalScores: {
    name: string | null;
    totalScore: number;
  }[];
  daysInMonth: number[];
  hasWorkedOutToday: boolean;
  workoutChartData: {
    [user: string]: {
      dayNumber: number;
      scoreDay: number;
      scoreSum: number;
    }[];
  };
  lastFive: (Workout & {
    WorkoutType: WorkoutType | null;
    User: User | null;
  })[];
  scoreThisTimeLastMonth: number;
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

function getTotalScores(
  allWorkouts: (Workout & {
    WorkoutType: WorkoutType | null;
    User: User | null;
  })[]
) {
  const totalScoresMap = allWorkouts.reduce((sum: UserWorkoutMap, workout) => {
    sum[workout.User?.nickname ?? workout.User?.name ?? ""] =
      (sum[workout.User?.nickname ?? workout.User?.name ?? ""] ?? 0) +
      workout.points;
    return sum;
  }, {});

  const totalScores = Object.keys(totalScoresMap)
    .map((key) => ({
      name: key,
      totalScore: totalScoresMap[key] ?? 0,
    }))
    .sort((k, p) => (p.totalScore > k.totalScore ? 1 : -1));

  return totalScores;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  const daysInMonth = getDaysInMonth(monthStart, monthEnd);

  const myWorkoutsLastMonth = await prisma.workout.findMany({
    where: {
      date: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
      userId: session?.user?.id ?? "",
    },
  });

  const scoreThisTimeLastMonth = myWorkoutsLastMonth
    .filter((workout) => isBefore(addMonths(workout.date, 1), new Date()))
    .reduce((a, b) => a + b.points, 0);

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
      const nameOrNick = workout.User?.nickname ?? workout.User?.name;
      if (nameOrNick === undefined || nameOrNick === null) {
        throw Error("Could not find user");
      }
      if (sum[nameOrNick] === undefined) {
        sum[nameOrNick] = [];
      }
      sum[nameOrNick]?.push(workout);
      return sum;
    },
    {}
  );

  const workoutChartData = Object.keys(workoutDict).reduce((sum, user) => {
    let userScoreSum = 0;
    const result = daysInMonth.map((dayNumber) => {
      let score = 0;
      const day = new Date();
      day.setDate(dayNumber);

      workoutDict[user]?.filter((workout) => {
        if (isSameDay(workout.date, day)) {
          score += workout.points;
          userScoreSum += workout.points;
        }
      });
      return {
        dayNumber: dayNumber,
        scoreDay: score,
        scoreSum: userScoreSum,
      };
    });
    return {
      ...sum,
      [user]: result,
    };
  }, {});

  return {
    props: {
      // globals
      daysInMonth,
      today: new Date(),
      // user data
      totalScores: getTotalScores(allWorkouts),
      workoutChartData,
      hasWorkedOutToday: !!allWorkouts
        .filter((el) => el.User?.id === session?.user?.id)
        .find((el) => isToday(el.date)),
      lastFive,
      scoreThisTimeLastMonth,
    },
  };
};

const Home: NextPage<Props> = ({
  totalScores,
  daysInMonth,
  workoutChartData,
  hasWorkedOutToday,
  lastFive,
  today,
  scoreThisTimeLastMonth,
}) => {
  const router = useRouter();
  const session = useSession();
  const { data: workoutTypesData, isLoading } = trpc.useQuery([
    "workout.workouttypes",
  ]);

  useEffect(() => {
    if (router.query.action === "addworkoutsuccess") {
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  }, [router.query.action, router]);

  if (session.status == "loading" || isLoading) {
    return <Loader />;
  }

  if (session.status == "unauthenticated") {
    return <LoggedOut />;
  }

  if (!workoutTypesData?.workoutTypes) {
    throw new Error("No data?!");
  }

  return (
    <>
      <Head>
        <title>Treningsutfordring</title>
        <meta name="description" content="Workout Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
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

        <Sum />

        <TotalScore totalScores={totalScores} />

        <Spacer />
        <Text>
          Siste måned på denne dagen hadde du {scoreThisTimeLastMonth} poeng
        </Text>

        <Spacer />
        <WorkoutNewsFeed lastFive={lastFive} />
        <Spacer />
        <OverviewChart data={workoutChartData} daysInMonth={daysInMonth} />
        <Spacer />
        <ProgressLineChart
          data={workoutChartData}
          daysInMonth={daysInMonth}
          today={today}
        />
        <Spacer />
        <AddWorkoutLinks workoutTypes={workoutTypesData?.workoutTypes} />
        <Spacer />

        <Link href="workouts">
          <Button colorScheme="orange">Se treninger</Button>
        </Link>

        <Spacer />

        <Button onClick={() => signOut()}>Logg ut</Button>
      </>
    </>
  );
};

export default Home;
