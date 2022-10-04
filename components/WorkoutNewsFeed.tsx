import { Box, Flex, Heading } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import { WorkoutView } from "./WorkoutView";

interface Props {
  lastFive: (Workout & {
    WorkoutType: WorkoutType | null;
    User: User | null;
  })[];
}

export const WorkoutNewsFeed = ({ lastFive }: Props) => {
  return (
    <Box>
      <Heading size="md" mb="5">
        Siste treninger
      </Heading>
      <Flex textAlign="left" flexDirection="column" gap="2">
        {lastFive.map((workout) => {
          return <WorkoutView key={workout.id} workout={workout}></WorkoutView>;
        })}
      </Flex>
    </Box>
  );
};
