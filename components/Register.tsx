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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import { useState } from "react";
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

type States = "IDLE" | "LOADING" | "SUCCESS";

export const Register = ({ workoutType }: Props) => {
  const [state, setState] = useState<States>("IDLE");

  const { mutate } = trpc.useMutation(["workout.workout"]);

  const { control, handleSubmit, watch } = useForm<Values>({
    defaultValues: {
      iterations: "0",
      length: "0",
    },
  });

  const formSubmit = (values: Values) => {
    setState("LOADING");
    mutate({
      workoutId: workoutType.id,
      iterations: parseInt(values.iterations),
      length: parseInt(values.length),
    });
    setState("SUCCESS");
  };

  if (state === "LOADING") {
    return <Loader />;
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
        {state === "SUCCESS" ? (
          <>
            <Spacer />
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Workout lagret</AlertTitle>
              <AlertDescription>Godt jobbet!!!</AlertDescription>
            </Alert>
          </>
        ) : null}
      </FormControl>
    </form>
  );
};
