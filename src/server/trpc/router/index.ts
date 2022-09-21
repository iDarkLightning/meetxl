// src/server/trpc/router/index.ts
import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

export const appRouter = t.router({
  test: t.procedure.query(async () => {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Bad!" });
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
