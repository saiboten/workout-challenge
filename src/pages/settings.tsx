import { Button, Heading } from "@chakra-ui/react";
import { Loader } from "components/lib/Loader";
import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { AddNickName } from "../../components/AddNickName";

const Home: NextPage = () => {
  // todo
  const { data, isLoading } = api.settings.getUser.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    throw new Error("Ingen data?!");
  }

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

        <AddNickName nickname={data.existingNickName} />

        <Button onClick={() => signOut()}>Logg ut</Button>
      </>
    </>
  );
};

export default Home;
