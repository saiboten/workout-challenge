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
} from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { trpc } from "../src/utils/trpc";
import { Loader } from "./lib/Loader";
import { Spacer } from "./lib/Spacer";

interface Values {
  length: string;
  type: WorkoutType;
  iterations: string;
}

interface Props {
  workout: WorkoutType;
}

type States = "IDLE" | "LOADING" | "SUCCESS";

export const Register = ({ workout }: Props) => {
  const [state, setState] = useState<States>("IDLE");

  const { mutate } = trpc.useMutation(["workout.workout"]);

  const { control, handleSubmit } = useForm<Values>({
    defaultValues: {
      iterations: "0",
      length: "0",
    },
  });

  const formSubmit = (values: Values) => {
    setState("LOADING");
    mutate({
      workoutId: workout.id,
      iterations: parseInt(values.iterations),
      length: parseInt(values.length),
    });
    setState("SUCCESS");
  };

  if (state === "LOADING") {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Heading mb="5" size="lg">
        {workout.name}
      </Heading>
      <FormControl mb="5">
        {workout.hasLength ? (
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
        {workout.hasIterations ? (
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
