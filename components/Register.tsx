import {
  Box,
  Button,
  Input,
  InputGroup,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Spacer } from "./lib/Spacer";

interface Values {
  length: number;
  type: WorkoutType;
  iterations: number;
}

interface Props {
  workout: WorkoutType;
}

export const Register = ({ workout }: Props) => {
  const { register, control, handleSubmit } = useForm<Values>({
    defaultValues: {
      iterations: 0,
      length: 0,
    },
  });

  const formSubmit = (values: Values) => {
    console.log(values);
  };

  console.log(workout);

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
      </FormControl>
    </form>
  );
};
