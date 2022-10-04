import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import Link from "next/link";
import { Spacer } from "./lib/Spacer";

interface Props {
  workoutTypes: WorkoutType[];
}

export const AddWorkoutLinks = ({ workoutTypes }: Props) => {
  return (
    <Box borderRadius="10px" minWidth="100%">
      <Heading size="md">Legg til trening</Heading>
      <Spacer />
      <Stack
        direction={{ base: "row" }}
        align="center"
        maxWidth="500px"
        flexWrap="wrap"
        gap="2"
      >
        {workoutTypes.map((workout) => {
          return (
            <>
              <Link key={workout.id} href={`/create/${workout.id}`}>
                <Button colorScheme="teal">{workout.name}</Button>
              </Link>
            </>
          );
        })}
      </Stack>
    </Box>
  );
};
