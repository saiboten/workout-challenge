import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { trpc } from "../src/utils/trpc";
import { calculateScore } from "../utils/score";
import { Loader } from "./lib/Loader";
import { Spacer } from "./lib/Spacer";

interface Values {
  length: string;
  type: WorkoutType;
  iterations: string;
}

interface Props {
  workoutType: WorkoutType;
}

export const Register = ({ workoutType }: Props) => {
  const router = useRouter();

  const { mutate, status } = trpc.useMutation(["workout.workout"]);

  const { control, handleSubmit, watch } = useForm<Values>({
    defaultValues: {
      iterations: "0",
      length: "0",
    },
  });

  const formSubmit = (values: Values) => {
    mutate({
      workoutId: workoutType.id,
      iterations: parseInt(values.iterations),
      length: parseInt(values.length),
    });
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "success") {
    router.push("/?action=addworkoutsuccess");
  }

  const { iterations, length } = watch();

  const score = calculateScore(
    {
      workoutId: workoutType.id,
      iterations: parseInt(iterations) ?? 0,
      length: parseInt(length) ?? 0,
    },
    workoutType
  );

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Heading mb="5" size="lg">
        {workoutType.name}
      </Heading>
      <Spacer />
      <Box>Denne treningen gir en verdi på {score} poeng</Box>
      <Spacer />

      <FormControl mb="5">
        {workoutType.hasLength ? (
          <>
            <FormLabel>Lengde</FormLabel>
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <NumberInput step={5} {...field}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </>
        ) : null}
        {workoutType.hasIterations ? (
          <>
            <FormLabel>Antall reps</FormLabel>
            <Controller
              name="iterations"
              control={control}
              render={({ field }) => (
                <NumberInput step={5} {...field}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </>
        ) : null}
        <Spacer />
        <Button type="submit">Lagre</Button>
      </FormControl>
    </form>
  );
};
