import { Heading, Button, Flex, Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { LoggedOut } from "../../components/LoggedOut";
import { Wrapper } from "../../components/lib/Wrapper";
import Link from "next/link";
import { Spacer } from "../../components/lib/Spacer";
import { Loader } from "../../components/lib/Loader";
import { WorkoutView } from "../../components/WorkoutView";
import { api } from "~/utils/api";
import { useState } from "react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const WorkOuts: NextPage = () => {
  const [index, setIndex] = useState(0);
  const { data: workouts, isLoading } =
    api.workout.getWorkoutList.useQuery(index);
  const session = useSession();

  if (isLoading) {
    return <Loader />;
  }

  if (session.status == "unauthenticated") {
    return <LoggedOut />;
  }

  if (!workouts) {
    throw new Error("No workouts");
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
          Treninger
        </Heading>

        <Box>Side {index + 1}</Box>

        <Flex
          maxWidth="320px"
          justifyContent="center"
          gap="1rem"
          margin="1rem auto"
        >
          <Button isDisabled={index <= 0} onClick={() => setIndex(index - 1)}>
            <ArrowBackIcon />
          </Button>
          <Button
            isDisabled={workouts.length === 0}
            onClick={() => setIndex(index + 1)}
          >
            <ArrowForwardIcon />
          </Button>
        </Flex>

        <Flex textAlign="left" flexDirection="column" gap="2">
          {workouts.map((workout) => {
            return (
              <WorkoutView key={workout.id} workout={workout}></WorkoutView>
            );
          })}
        </Flex>
        <Spacer />
        <Link href="/">
          <Button colorScheme="teal">Tilbake</Button>
        </Link>
      </Wrapper>
    </>
  );
};

export default WorkOuts;
