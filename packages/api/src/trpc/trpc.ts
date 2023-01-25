import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error.cause?.name === "NotFoundError") {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: "NOT_FOUND",
          httpStatus: 404,
        },
      };
    }

    return shape;
  },
});
