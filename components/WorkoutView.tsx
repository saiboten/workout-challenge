import { Box, Heading } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import { format } from "date-fns";
import { Spacer } from "./lib/Spacer";
interface Props {
  workout: Workout & {
    WorkoutType: WorkoutType | null;
    User?: User | null;
  };
}

export const WorkoutView = ({ workout }: Props) => {
  return (
    <Box key={workout.id} border="1px solid black" padding="5">
      {workout.User ? <Heading size="md">{workout.User?.name}</Heading> : null}
      <Heading size="sm">
        {format(workout.date, "d. MMMM HH:mm")}: {workout.WorkoutType?.name}
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
};
