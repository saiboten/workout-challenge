import { Link } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import { api } from "~/utils/api";
import Router, { useRouter } from "next/router";
import { Loader } from "../../../components/lib/Loader";
import { Wrapper } from "../../../components/lib/Wrapper";
import { LoggedOut } from "../../../components/LoggedOut";
import { Register } from "../../../components/Register";

const Home: NextPage = () => {
  const session = useSession();

  const router = useRouter();
  const { type } = router.query;

  if (typeof type !== "string") {
    throw new Error("Nope");
  }

  const { data: workoutTypeData, isLoading } =
    api.workout.getWorkoutType.useQuery(type);

  if (session.status == "loading" || isLoading) {
    return <Loader />;
  }

  if (session.status == "unauthenticated") {
    return <LoggedOut />;
  }

  if (!workoutTypeData) {
    throw new Error("What");
  }

  return (
    <>
      <Head>
        <title>Workout Challenge</title>
        <meta name="description" content="Workout Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <Register workoutType={workoutTypeData} />
        <NextLink href="/" passHref>
          <Link>Tilbake</Link>
        </NextLink>
      </Wrapper>
    </>
  );
};

export default Home;
