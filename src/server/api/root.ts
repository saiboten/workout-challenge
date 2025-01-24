import { createTRPCRouter } from "~/server/api/trpc";
import { settingsRouter } from "~/server/api/routers/settings";
import { workoutRouter } from "~/server/api/routers/workout";
import { homepageRouter } from "~/server/api/routers/homepage";
import { chartRouter } from "./routers/chart";
import { awardRouter } from "./routers/award";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  workout: workoutRouter,
  homepage: homepageRouter,
  chart: chartRouter,
  award: awardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
