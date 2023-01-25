import { z } from "zod";
import { orgAdminProcedure, orgMemberProcedure } from "./org-procedures";

export const meetingAdminProcedure = orgAdminProcedure
  .input(z.object({ meetingId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const meeting = await ctx.prisma.meeting.findFirstOrThrow({
      where: {
        OR: [{ id: input.meetingId }, { slug: input.meetingId }],
        organizationSlug: ctx.org.slug,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return next({ ctx: { meeting } });
  });

export const meetingMemberProcedure = orgMemberProcedure
  .input(z.object({ meetingId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const meeting = await ctx.prisma.meeting.findFirstOrThrow({
      where: {
        AND: [
          {
            OR: [{ id: input.meetingId }, { slug: input.meetingId }],
          },
          {
            OR: [
              {
                participants: {
                  some: {
                    memberUserId: ctx.session.user.id,
                  },
                },
              },
              {
                organization: {
                  members: {
                    some: {
                      userId: ctx.session.user.id,
                      role: "ADMIN",
                    },
                  },
                },
              },
              {
                isPublic: true,
              },
            ],
          },
        ],
        organizationSlug: ctx.org.slug,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return next({ ctx: { meeting } });
  });
