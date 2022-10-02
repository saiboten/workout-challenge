import { createRouter } from "./context";
import { z } from "zod";
import { WorkoutType } from "@prisma/client";

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

const input = z
  .object({
    workoutId: z.number(),
    length: z.number().optional(),
    iterations: z.number().optional(),
  })
  .nullish();

export const createWorkoutRouter = createRouter().mutation("workout", {
  input,
  async resolve({ input, ctx }) {
    const workOutType = await ctx.prisma?.workoutType.findUnique({
      where: {
        id: input?.workoutId,
      },
    });

    if (!workOutType) {
      throw new Error("Could not find workout type");
    }

    const res = await ctx.prisma?.workout.create({
      data: {
        date: new Date(),
        length: input?.length ?? 0,
        iterations: input?.iterations ?? 0,
        points: calculateScore(input, workOutType),
        userId: ctx.session?.user?.id,
        workoutTypeId: input?.workoutId,
      },
    });

    return {
      workout: res,
    };
  },
});
