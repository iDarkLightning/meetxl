import { createAttributeLinkShema } from "@/lib/schemas/link-schemas";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgAttributeLinkRouter = t.router({
  create: orgAdminProcedure
    .input(createAttributeLinkShema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.attributeLink.create({
        data: {
          organizationAttribute: {
            connect: {
              name_organizationId: {
                name: input.attributeName,
                organizationId: ctx.org.id,
              },
            },
          },
          name: input.name,
          value: input.value,
          action: input.action,
          code: randomBytes(3).toString("hex"),
          issuer: {
            connect: {
              organizationId_userId: {
                organizationId: ctx.org.id,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),

  list: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attributeLink.findMany({
        where: {
          organizationAttribute: {
            organizationId: ctx.org.id,
            name: input.name,
          },
        },
        include: {
          issuer: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getDetailed: orgAdminProcedure
    .input(z.object({ code: z.string(), attributeName: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attributeLink.findUniqueOrThrow({
        where: {
          organizationAttributeName_orgId_code: {
            code: input.code,
            orgId: ctx.org.id,
            organizationAttributeName: input.attributeName,
          },
        },
        include: {
          redeemedBy: {
            include: {
              member: {
                select: {
                  user: true,
                },
              },
            },
          },
        },
      });
    }),

  getPersonal: orgMemberProcedure
    .input(z.object({ code: z.string(), attributeName: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attributeLink.findUniqueOrThrow({
        where: {
          organizationAttributeName_orgId_code: {
            code: input.code,
            orgId: ctx.org.id,
            organizationAttributeName: input.attributeName,
          },
        },
        include: {
          redeemedBy: {
            where: {
              memberUserId: ctx.session.user.id,
            },
            take: 1,
          },
        },
      });
    }),

  apply: orgMemberProcedure
    .input(z.object({ code: z.string(), attributeName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.prisma.attributeLink.findUniqueOrThrow({
        where: {
          organizationAttributeName_orgId_code: {
            code: input.code,
            orgId: ctx.org.id,
            organizationAttributeName: input.attributeName,
          },
        },
        include: {
          redeemedBy: {
            where: {
              memberUserId: ctx.session.user.id,
            },
            take: 1,
          },
        },
      });

      if (link.redeemedBy.length > 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Already redeemed" });
      }

      await ctx.prisma.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: ctx.org.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          attributes: {
            update: {
              where: {
                organizationAttributeName_orgId_userId: {
                  organizationAttributeName: input.attributeName,
                  orgId: ctx.org.id,
                  userId: ctx.session.user.id,
                },
              },
              data: {
                value: {
                  [link.action === "SET" ? "set" : "increment"]:
                    link.action === "DECREMENT" ? -link.value : link.value,
                },
              },
            },
          },
          redeemedAttributeLinks: {
            connectOrCreate: {
              where: {
                linkId_memberOrganizationId_memberUserId: {
                  linkId: link.id,
                  memberOrganizationId: ctx.org.id,
                  memberUserId: ctx.session.user.id,
                },
              },
              create: {
                link: {
                  connect: {
                    id: link.id,
                  },
                },
              },
            },
          },
        },
      });
    }),

  delete: orgAdminProcedure
    .input(z.object({ linkId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.attributeLink.delete({
        where: {
          id: input.linkId,
        },
      });
    }),
});
