import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  addDays,
  addMonths,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from "date-fns";

import { Workout } from "@prisma/client";
import { z } from "zod";

const getDaysInMonth = (monthStart: Date, monthEnd: Date): number[] => {
  const returnList = [];
  let currentDate = monthStart;

  while (currentDate < monthEnd) {
    returnList.push(currentDate.getDate());
    currentDate = addDays(currentDate, 1);
  }

  return returnList;
};

export const chartRouter = createTRPCRouter({
  getChart: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const today = new Date();
      const monthStart = addMonths(startOfMonth(new Date()), input);
      const monthEnd = addMonths(endOfMonth(new Date()), input);

      const daysInMonth = getDaysInMonth(monthStart, monthEnd);

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

      const workoutChartData: {
        [id: string]: {
          dayNumber: number;
          scoreDay: number;
          scoreSum: number;
        }[];
      } = Object.keys(workoutDict).reduce((sum, user) => {
        let userScoreSum = 0;
        const result = daysInMonth.map((dayNumber) => {
          let score = 0;
          const day = addMonths(new Date(), input);
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
        workoutChartData,
        daysInMonth,
        today,
        isEmpty: allWorkouts.length === 0,
      };
    }),
});
