import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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

export const workoutRouter = createTRPCRouter({
  workout: protectedProcedure.input(input).mutation(async ({ input, ctx }) => {
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
  }),
  workouttypes: protectedProcedure.query(async ({ ctx }) => {
    const workoutTypes = await ctx.prisma.workoutType.findMany();

    return {
      workoutTypes,
    };
  }),
  totalscore: protectedProcedure.query(async ({ ctx }) => {
    const workoutsUser = await ctx.prisma.workout.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
    });

    const sum = workoutsUser.reduce((sum, next) => {
      return next.points + sum;
    }, 0);

    return {
      sum,
    };
  }),
  getWorkoutType: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!input) {
        throw Error("could not find query");
      }

      const workout = await ctx.prisma.workoutType.findUniqueOrThrow({
        where: {
          id: Number(input),
        },
      });

      return workout;
    }),
});
