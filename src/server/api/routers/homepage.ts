import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  addDays,
  addMonths,
  endOfMonth,
  isBefore,
  isSameDay,
  isToday,
  setDate,
  startOfMonth,
  subMonths,
} from "date-fns";

import { User, Workout, WorkoutType } from "@prisma/client";

interface UserWorkoutMap {
  [id: string]: number;
}

const getDaysInMonth = (monthStart: Date, monthEnd: Date): number[] => {
  const returnList = [];
  let currentDate = monthStart;

  while (currentDate < monthEnd) {
    returnList.push(currentDate.getDate());
    currentDate = addDays(currentDate, 1);
  }

  return returnList;
};

export const homepageRouter = createTRPCRouter({
  homedata: protectedProcedure.query(async ({ ctx }) => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const daysInMonth = getDaysInMonth(monthStart, monthEnd);

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

    const workoutDict = allWorkouts.reduce(
      (sum: { [id: string]: Workout[] }, workout) => {
        const nameOrNick = workout.User?.nickname ?? workout.User?.name;
        if (nameOrNick === undefined || nameOrNick === null) {
          throw Error("Could not find user");
        }
        if (sum[nameOrNick] === undefined) {
          sum[nameOrNick] = [];
        }
        sum[nameOrNick]?.push(workout);
        return sum;
      },
      {}
    );

    const workoutChartData = Object.keys(workoutDict).reduce((sum, user) => {
      let userScoreSum = 0;
      const result = daysInMonth.map((dayNumber) => {
        let score = 0;
        const day = new Date();
        day.setDate(dayNumber);

        workoutDict[user]?.filter((workout) => {
          if (isSameDay(workout.date, day)) {
            score += workout.points;
            userScoreSum += workout.points;
          }
        });
        return {
          dayNumber: dayNumber,
          scoreDay: score,
          scoreSum: userScoreSum,
        };
      });
      return {
        ...sum,
        [user]: result,
      };
    }, {});

    return {
      // globals
      daysInMonth,
      today: new Date(),
      // user data
      workoutChartData,
      hasWorkedOutToday: !!allWorkouts
        .filter((el) => el.User?.id === ctx.session?.user?.id)
        .find((el) => isToday(el.date)),
      lastFive,
      scoreThisTimeLastMonth,
    };
  }),
});
