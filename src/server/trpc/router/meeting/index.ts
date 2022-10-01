import { z } from "zod";
import { Context } from "../../context";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";
import { meetingParticipantRouter } from "./meeting-participant";
import { meetingRewardRouter } from "./meeting-reward";

const generateMeetingSlug = async (name: string, ctx: Context) => {
  const slug = name
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/[^\w-]+/g, "");

  const orgs = await ctx.prisma.meeting.findMany({ where: { slug } });

  if (orgs.length > 0) {
    return slug + orgs.length;
  }

  return slug;
};

export const meetingRouter = t.router({
  create: orgAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meeting.create({
        data: {
          name: input.name,
          slug: await generateMeetingSlug(input.name, ctx),
          organizationSlug: ctx.org.slug,
        },
      });
    }),

  list: orgMemberProcedure.query(async ({ ctx }) => {
    const orgMember = await ctx.prisma.organizationMember.findUniqueOrThrow({
      where: {
        organizationId_userId: {
          organizationId: ctx.org.id,
          userId: ctx.session.user.id,
        },
      },
    });

    if (orgMember.role === "ADMIN") {
      return ctx.prisma.meeting.findMany({
        where: {
          organizationSlug: ctx.org.slug,
        },
      });
    }

    return ctx.prisma.meeting.findMany({
      where: {
        OR: [
          {
            participants: {
              some: {
                memberUserId: ctx.session.user.id,
              },
            },
          },
          {
            isPublic: true,
          },
        ],
      },
    });
  }),

  get: orgMemberProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.meeting.findUniqueOrThrow({
        where: {
          organizationSlug_slug: {
            organizationSlug: ctx.org.slug,
            slug: input.slug,
          },
        },
      });
    }),

  reward: meetingRewardRouter,
  participant: meetingParticipantRouter,
});
