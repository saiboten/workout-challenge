// import { Heading, Button, Flex } from "@chakra-ui/react";
// import { Workout, WorkoutType } from "@prisma/client";
import type { NextPage } from "next";
// import { endOfMonth, startOfMonth } from "date-fns";
// import { useSession } from "next-auth/react";
// import Head from "next/head";
// import { LoggedOut } from "../../components/LoggedOut";
// import { Wrapper } from "../../components/lib/Wrapper";
// import Link from "next/link";
// import { Spacer } from "../../components/lib/Spacer";
// import { Loader } from "../../components/lib/Loader";
// import { WorkoutView } from "../../components/WorkoutView";

// interface Props {
//   workouts: (Workout & {
//     WorkoutType: WorkoutType | null;
//   })[];
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await unstable_getServerSession(
//     context.req,
//     context.res,
//     authOptions
//   );

//   const monthStart = startOfMonth(new Date());
//   const monthEnd = endOfMonth(new Date());

//   const workouts = (
//     await prisma.workout.findMany({
//       where: {
//         date: {
//           gte: monthStart,
//           lte: monthEnd,
//         },
//         userId: session?.user?.id,
//       },
//       include: {
//         WorkoutType: true,
//       },
//     })
//   ).sort((el1, el2) => (el1.date < el2.date ? 1 : -1));

//   return {
//     props: {
//       workouts,
//     },
//   };
// };

const WorkOuts: NextPage = () => {
  // const session = useSession();

  // if (session.status == "loading") {
  //   return <Loader />;
  // }

  // if (session.status == "unauthenticated") {
  //   return <LoggedOut />;
  // }

  return <div>Work in progress</div>;

  // return (
  //   <>
  //     <Head>
  //       <title>Treningsutfordring</title>
  //       <meta name="description" content="Workout Challenge" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <Wrapper>
  //       <Heading mb="5" size="lg">
  //         Treninger
  //       </Heading>

  //       <Flex textAlign="left" flexDirection="column" gap="2">
  //         {workouts.map((workout) => {
  //           return (
  //             <WorkoutView key={workout.id} workout={workout}></WorkoutView>
  //           );
  //         })}
  //       </Flex>
  //       <Spacer />
  //       <Link href="/">
  //         <Button colorScheme="teal">Tilbake</Button>
  //       </Link>
  //     </Wrapper>
  //   </>
  // );
};

export default WorkOuts;
