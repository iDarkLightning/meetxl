// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { organizationRouter } from "./org-router";

export const appRouter = t.router({
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
