import { WorkoutType } from "@prisma/client";
import { z } from "zod";

const input = z
  .object({
    workoutId: z.number(),
    length: z.number().optional(),
    iterations: z.number().optional(),
  })
  .nullish();

export function calculateScore(
  workout: z.infer<typeof input>,
  workoutType: WorkoutType
): number {
  let sum = 0;

  if (workoutType.canBeCompleted) {
    sum += workoutType.completePoints ?? 0;
  }

  if (workoutType.hasLength) {
    sum += (workout?.length ?? 0) * (workoutType.lengthPoints ?? 0);
  }

  if (workoutType.hasIterations) {
    sum += (workout?.iterations ?? 0) * (workoutType.iterationsPoints ?? 0);
  }

  return sum;
}
