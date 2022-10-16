import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { orgAdminProcedure } from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgAttributeRouter = t.router({
  create: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const attribute = await ctx.prisma.organizationAttribute.create({
          data: {
            name: input.name,
            organizationId: ctx.org.id,
          },
        });

        const members = await ctx.prisma.organizationMember.findMany({
          where: {
            organizationId: ctx.org.id,
            role: "MEMBER",
          },
        });

        await ctx.prisma.$transaction(
          members.map((member) =>
            ctx.prisma.organizationMember.update({
              where: {
                organizationId_userId: {
                  organizationId: ctx.org.id,
                  userId: member.userId,
                },
              },
              data: {
                attributes: {
                  create: {
                    attribute: {
                      connect: {
                        name_organizationId: {
                          name: attribute.name,
                          organizationId: ctx.org.id,
                        },
                      },
                    },
                    value: 0,
                  },
                },
              },
            })
          )
        );

        return attribute;
      } catch (err) {
        console.error(err);
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
        include: {
          rewards: {
            include: {
              meeting: true,
            },
          },
          memberAttributes: {
            include: {
              orgMember: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    }),

  delete: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organizationAttribute.delete({
        where: {
          name_organizationId: {
            name: input.name,
            organizationId: ctx.org.id,
          },
        },
      });
    }),
});
