// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { createWorkoutRouter } from "./workout";
import { createSettingsRouter } from "./settings";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workout.", createWorkoutRouter)
  .merge("settings.", createSettingsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
