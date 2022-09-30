import { Link } from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import { Wrapper } from "../../../components/lib/Wrapper";
import { LoggedOut } from "../../../components/LoggedOut";
import { Register } from "../../../components/Register";
import { prisma } from "../../server/db/client";

interface Props {
  workout: WorkoutType;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Props }> {
  const { type } = context.query;

  if (!type) {
    throw Error("could not find query");
  }

  const workout = await prisma.workoutType.findUniqueOrThrow({
    where: {
      id: Number(type),
    },
  });

  return {
    props: {
      workout,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<Props> = ({ workout }) => {
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
      <Wrapper>
        <Register workoutType={workout} />
        <NextLink href="/" passHref>
          <Link>Tilbake</Link>
        </NextLink>
      </Wrapper>
    </>
  );
};

export default Home;
