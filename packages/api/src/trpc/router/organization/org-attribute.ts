import { createAttributeSchema } from "@meetxl/shared/schemas/org-schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";
import { orgAttributeLinkRouter } from "./org-attribute-link";

export const orgAttributeRouter = t.router({
  create: orgAdminProcedure
    .input(createAttributeSchema)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any).code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Attribute already exists",
          });
        }
      }
    }),

  manualSync: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const members = await ctx.prisma.organizationMember.findMany({
        where: {
          organizationId: ctx.org.id,
          attributes: {
            every: {
              NOT: {
                organizationAttributeName: input.name,
              },
            },
          },
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
                        name: input.name,
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
            orderBy: {
              value: "desc",
            },
          },
        },
      });
    }),

  mine: orgMemberProcedure.query(({ ctx }) => {
    return ctx.prisma.memberAttribute.findMany({
      where: {
        orgId: ctx.org.id,
        userId: ctx.session.user.id,
      },
    });
  }),

  toggleAllLinks: orgAdminProcedure
    .input(
      z.object({
        name: z.string(),
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.attributeLink.updateMany({
        where: {
          organizationAttributeName: input.name,
        },
        data: {
          enabled: input.enabled,
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

  set: orgAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        attributeName: z.string(),
        value: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.memberAttribute.update({
        where: {
          organizationAttributeName_orgId_userId: {
            organizationAttributeName: input.attributeName,
            orgId: ctx.org.id,
            userId: input.userId,
          },
        },
        data: {
          value: input.value,
        },
      });
    }),

  links: orgAttributeLinkRouter,
});
