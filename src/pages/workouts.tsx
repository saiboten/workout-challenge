import { Heading, Button, Flex } from "@chakra-ui/react";
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

const WorkOuts: NextPage = () => {
  const { data: workouts, isLoading } = api.workout.getWorkoutList.useQuery();
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
