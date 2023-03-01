import { createTRPCRouter } from "~/server/api/trpc";
import { settingsRouter } from "~/server/api/routers/settings";
import { workoutRouter } from "~/server/api/routers/workout";
import { homepageRouter } from "~/server/api/routers/homepage";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  workout: workoutRouter,
  homepage: homepageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
