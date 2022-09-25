// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { meetingRouter } from "./meeting-router";
import { organizationRouter } from "./organization";

export const appRouter = t.router({
  organization: organizationRouter,
  meeting: meetingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
