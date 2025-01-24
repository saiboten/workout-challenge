import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const awardRouter = createTRPCRouter({
  totalScoreAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const allWorkouts = await ctx.prisma.workout.findMany({});

    const sum = allWorkouts.reduce((sum, next) => {
      return next.points + sum;
    }, 0);

    return sum;
  }),
});
