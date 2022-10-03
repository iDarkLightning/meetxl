// src/utils/trpc.ts
import { httpBatchLink, loggerLink, TRPCClientErrorLike } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/trpc/router";
import superjson from "superjson";
import { Maybe } from "@trpc/server";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 1000,
            retry(failureCount, _err) {
              const err = _err as never as Maybe<
                TRPCClientErrorLike<AppRouter>
              >;
              const code = err?.data?.code;

              if (
                code === "BAD_REQUEST" ||
                code === "FORBIDDEN" ||
                code === "UNAUTHORIZED" ||
                code === "NOT_FOUND"
              ) {
                return false;
              }

              const MAX_QUERY_RETRIES = 3;
              return failureCount < MAX_QUERY_RETRIES;
            },
          },
        },
      },
    };
  },
  ssr: false,
});
