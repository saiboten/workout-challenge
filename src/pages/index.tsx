import {
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Flex,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { LoggedOut } from "../../components/LoggedOut";
import { OverviewChart } from "../../components/OverviewChart";
import { Spacer } from "../../components/lib/Spacer";
import { Loader } from "../../components/lib/Loader";
import { useRouter } from "next/router";
import { TotalScore } from "../../components/TotalScore";
import { useEffect } from "react";
import { WorkoutNewsFeed } from "../../components/WorkoutNewsFeed";
import { AddWorkoutLinks } from "../../components/AddWorkoutLinks";
import { ProgressLineChart } from "../../components/ProgressLineChart";
import { Sum } from "../../components/Sum";
import { api } from "~/utils/api";
import { addMonths } from "date-fns";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Award } from "components/Award";

const options1 = {
  year: "numeric",
  month: "long",
} as const;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const dateFormatter = new Intl.DateTimeFormat("nb-NO", options1);

const Home: NextPage = ({}) => {
  const [month, setMonth] = useState(0);

  const router = useRouter();
  const session = useSession();

  const { data: workoutTypesData, isLoading } =
    api.workout.workouttypes.useQuery();

  const { data: homedata, isLoading: homepageDataLoading } =
    api.homepage.homedata.useQuery();

  useEffect(() => {
    if (router.query.action === "addworkoutsuccess") {
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  }, [router.query.action, router]);

  if (session.status == "loading" || isLoading || homepageDataLoading) {
    return <Loader />;
  }

  if (session.status == "unauthenticated") {
    return <LoggedOut />;
  }

  if (!workoutTypesData?.workoutTypes) {
    throw new Error("No data?!");
  }

  if (!workoutTypesData?.workoutTypes) {
    throw new Error("No data?!");
  }

  if (!homedata) {
    throw new Error("No home page data?");
  }

  const { hasWorkedOutToday, lastFive, scoreThisTimeLastMonth } = homedata;

  const monthText = addMonths(new Date(), month);

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

        <Award />

        <Sum />

        <Text marginBottom="1rem">
          Siste måned på denne dagen hadde du{" "}
          <strong>{scoreThisTimeLastMonth} poeng</strong>
        </Text>

        <Text fontSize={"1.5rem"}>
          {capitalize(dateFormatter.format(monthText))}
        </Text>
        <Flex
          justifyContent="flex-start"
          maxWidth="320px"
          marginTop="1rem"
          marginBottom="1rem"
        >
          <Button type="button" onClick={() => setMonth(month - 1)}>
            <ArrowBackIcon boxSize={6} /> Forrige måned
          </Button>
          <Button
            isDisabled={addMonths(new Date(), month + 1) > new Date()}
            marginLeft="1rem"
            type="button"
            onClick={() => setMonth(month + 1)}
          >
            Neste måned <ArrowForwardIcon boxSize={6} />
          </Button>
        </Flex>

        <TotalScore month={month} />

        <Spacer />
        <WorkoutNewsFeed lastFive={lastFive} />
        <Spacer />
        <OverviewChart month={month} />
        <Spacer />
        <ProgressLineChart month={month} />
        <Spacer />
        <AddWorkoutLinks workoutTypes={workoutTypesData?.workoutTypes} />
        <Spacer />

        <Link href="workouts">
          <Button colorScheme="orange">Se treninger</Button>
        </Link>

        <Spacer />
      </>
    </>
  );
};

export default Home;
