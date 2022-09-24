import { MemberRole } from "@prisma/client";
import { z } from "zod";
import { Context } from "../../context";
import { authedProcedure } from "../../procedures/authed-procedure";
import { orgMemberProcedure } from "../../procedures/org-procedures";
import { t } from "../../trpc";
import { orgJoinCodeRouter } from "./join-code";

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
    .input(z.object({ name: z.string() }))
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
    const member = await ctx.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: ctx.org.id,
          userId: ctx.session.user.id,
        },
      },
    });

    return { ...ctx.org, member };
  }),

  joinCode: orgJoinCodeRouter,
});
