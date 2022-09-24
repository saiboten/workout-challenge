import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { LoggedOut } from "../../components/LoggedOut";
import { prisma } from "../server/db/client";

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
  workouts: WorkoutType[];
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  const workouts = await prisma.workoutType.findMany();

  return {
    props: {
      workouts,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<Props> = (props) => {
  // const { data } = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  const session = useSession();

  if (!session.data?.user) {
    return <LoggedOut />;
  }

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
              spacing={4}
              align="center"
            >
              {props.workouts.map((workout) => {
                return (
                  <Link key={workout.id} href={`/create/${workout.id}`}>
                    <Button colorScheme="teal">{workout.name}</Button>
                  </Link>
                );
              })}
            </Stack>
          </Box>

          <button onClick={() => signOut()}>Logg ut</button>
        </ContainerInner>
      </ContainerOuter>
    </>
  );
};

export default Home;
