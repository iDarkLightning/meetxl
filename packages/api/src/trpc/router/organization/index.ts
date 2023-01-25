import { createOrgSchema } from "@meetxl/shared/schemas/org-schemas";
import { MemberRole } from "@prisma/client";
import { Context } from "../../context";
import { authedProcedure } from "../../procedures/authed-procedure";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";
import { orgAttributeRouter } from "./org-attribute";
import { orgJoinCodeRouter } from "./org-join-code";
import { orgMembersRouter } from "./org-members";

const generateOrgSlug = async (name: string, ctx: Context) => {
  const slug = name
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/[^\w-]+/g, "");

  const orgs = await ctx.prisma.organization.findMany({ where: { slug } });

  if (orgs.length > 0) {
    return slug + orgs.length;
  }

  return slug;
};

export const organizationRouter = t.router({
  create: authedProcedure
    .input(createOrgSchema)
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug: await generateOrgSlug(input.name, ctx),
          members: {
            create: {
              userId: ctx.session.user.id,
              role: MemberRole.ADMIN,
            },
          },
        },
      });

      return org;
    }),

  list: authedProcedure.query(async ({ ctx }) => {
    const orgs = await ctx.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    return orgs;
  }),

  get: orgMemberProcedure.query(async ({ ctx }) => {
    const member = await ctx.prisma.organizationMember.findUniqueOrThrow({
      where: {
        organizationId_userId: {
          organizationId: ctx.org.id,
          userId: ctx.session.user.id,
        },
      },
    });

    return { ...ctx.org, member };
  }),

  getInsights: orgAdminProcedure.query(async ({ ctx }) => {
    const meeting = await ctx.prisma.meeting.findMany({
      where: {
        organizationSlug: ctx.org.slug,
      },
      select: {
        id: true,
        name: true,
        participants: {
          where: {
            status: "ATTENDED",
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      take: 5,
    });

    const counts = await ctx.prisma.organization.findUniqueOrThrow({
      where: {
        id: ctx.org.id,
      },
      select: {
        _count: {
          select: {
            members: true,
            joinCodes: true,
            attributes: true,
          },
        },
      },
    });

    return { meetings: meeting, counts };
  }),

  joinCode: orgJoinCodeRouter,
  members: orgMembersRouter,
  attribute: orgAttributeRouter,
});
