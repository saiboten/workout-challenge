import {
  Box,
  Heading,
  UnorderedList,
  ListItem,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Workout, WorkoutType } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { endOfMonth, format, parse, parseISO, startOfMonth } from "date-fns";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { LoggedOut } from "../../components/LoggedOut";
import { prisma } from "../server/db/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Wrapper } from "../../components/lib/Wrapper";
import Link from "next/link";
import { Spacer } from "../../components/lib/Spacer";
import { Loader } from "../../components/lib/Loader";

interface Props {
  workouts: (Workout & {
    WorkoutType: WorkoutType | null;
  })[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const workouts = (
    await prisma.workout.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        userId: session?.user?.id,
      },
      include: {
        WorkoutType: true,
      },
    })
  ).sort((el1, el2) => (el1.date < el2.date ? 1 : -1));
  // .map((el) => ({ ...el, date: el.date.toISOString() }));

  return {
    props: {
      workouts,
    },
  };
};

const WorkOuts: NextPage<Props> = ({ workouts }) => {
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
          Treninger
        </Heading>

        <Flex textAlign="left" flexDirection="column" gap="2">
          {workouts.map((workout) => {
            return (
              <Box key={workout.id} border="1px solid black" padding="5">
                <Heading size="sm">
                  {format(workout.date, "d. MMMM hh:mm")}:{" "}
                  {workout.WorkoutType?.name}
                </Heading>

                {workout.WorkoutType?.hasLength ? (
                  <Box>Varighet: {workout.length} minutter</Box>
                ) : null}

                {workout.WorkoutType?.hasIterations ? (
                  <Box>Antall repitisjoner: {workout.iterations}</Box>
                ) : null}
                <Spacer />
                <Box>
                  <strong>{workout.points}</strong> poeng
                </Box>
              </Box>
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
