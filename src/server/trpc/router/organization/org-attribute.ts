import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { orgAdminProcedure } from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgAttributeRouter = t.router({
  create: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.organizationAttribute.create({
          data: {
            name: input.name,
            organizationId: ctx.org.id,
          },
        });
      } catch (err) {
        if ((err as any).code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Attribute already exists",
          });
        }
      }
    }),

  list: orgAdminProcedure.query(({ ctx }) => {
    return ctx.prisma.organizationAttribute.findMany({
      where: {
        organizationId: ctx.org.id,
      },
    });
  }),

  get: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.organizationAttribute.findUniqueOrThrow({
        where: {
          name_organizationId: {
            name: input.name,
            organizationId: ctx.org.id,
          },
        },
      });
    }),
});
