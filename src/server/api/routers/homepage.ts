import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  addMonths,
  endOfMonth,
  isBefore,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";

export const homepageRouter = createTRPCRouter({
  homedata: protectedProcedure.query(async ({ ctx }) => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const myWorkoutsLastMonth = await ctx.prisma.workout.findMany({
      where: {
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        userId: ctx.session?.user?.id ?? "",
      },
    });

    const scoreThisTimeLastMonth = myWorkoutsLastMonth
      .filter((workout) => isBefore(addMonths(workout.date, 1), new Date()))
      .reduce((a, b) => a + b.points, 0);

    const allWorkouts = await ctx.prisma.workout.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        User: true,
        WorkoutType: true,
      },
    });

    const lastFive = allWorkouts.reverse().slice(0, 3);

    return {
      // user data
      hasWorkedOutToday: !!allWorkouts
        .filter((el) => el.User?.id === ctx.session?.user?.id)
        .find((el) => isToday(el.date)),
      lastFive,
      scoreThisTimeLastMonth,
    };
  }),
});
