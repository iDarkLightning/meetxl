import { z } from "zod";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgMembersRouter = t.router({
  list: orgAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.organizationMember.findMany({
      where: {
        organizationId: ctx.org.id,
      },
      include: {
        user: true,
      },
    });
  }),

  kick: orgAdminProcedure
    .input(z.object({ memberId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.organizationMember.delete({
        where: {
          organizationId_userId: {
            organizationId: ctx.org.id,
            userId: input.memberId,
          },
        },
      });
    }),

  getInsights: orgMemberProcedure.query(async ({ ctx }) => {
    const attendedMeetings = await ctx.prisma.meetingParticipant.findMany({
      where: {
        memberOrganizationId: ctx.org.id,
        status: "ATTENDED",
      },
      include: {
        meeting: true,
      },
    });

    const redeemedAttendanceLinks =
      await ctx.prisma.attendanceLinkRedeem.findMany({
        where: {
          meetingParticipantMemberUserId: ctx.session.user.id,
        },
        include: {
          link: {
            include: {
              meeting: true,
            },
          },
        },
      });

    const redeemedAttributeLinks =
      await ctx.prisma.attributeLinkRedeem.findMany({
        where: {
          memberUserId: ctx.session.user.id,
        },
        include: {
          link: true,
        },
      });

    return {
      attendedMeetings,
      redeemedAttendanceLinks,
      redeemedAttributeLinks,
    };
  }),
});
