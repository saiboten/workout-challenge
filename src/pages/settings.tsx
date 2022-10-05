import { Heading } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { prisma } from "../server/db/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { AddNickName } from "../../components/AddNickName";

interface Props {
  existingNickName?: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  return {
    props: {
      existingNickName: user?.nickname,
    },
  };
};

const Home: NextPage<Props> = ({ existingNickName }) => {
  return (
    <>
      <Head>
        <title>Treningsutfordring</title>
        <meta name="description" content="Workout Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Heading mb="5" size="lg">
          Innstillinger
        </Heading>

        <AddNickName nickname={existingNickName} />
      </>
    </>
  );
};

export default Home;
