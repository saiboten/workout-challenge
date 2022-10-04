import {
  Box,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import {
  addDays,
  endOfMonth,
  isSameDay,
  isToday,
  startOfMonth,
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
import { Wrapper } from "../../components/lib/Wrapper";
import { TotalScore } from "../../components/TotalScore";
import { useEffect } from "react";
import { WorkoutNewsFeed } from "../../components/WorkoutNewsFeed";
import { AddWorkoutLinks } from "../../components/AddWorkoutLinks";
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
