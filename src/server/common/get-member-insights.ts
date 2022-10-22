import { Organization } from "@prisma/client";
import { Context } from "../trpc/context";

export const getMemberInsights = async (
  ctx: Context & { org: Organization },
  userId: string
) => {
  const member = await ctx.prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: ctx.org.id,
        userId,
      },
    },
  });

  const attendedMeetings = await ctx.prisma.meetingParticipant.findMany({
    where: {
      memberUserId: userId,
      status: "ATTENDED",
    },
    include: {
      meeting: true,
    },
  });

  const redeemedAttendanceLinks =
    await ctx.prisma.attendanceLinkRedeem.findMany({
      where: {
        meetingParticipantMemberUserId: userId,
      },
      include: {
        link: {
          include: {
            meeting: true,
          },
        },
      },
    });

  const redeemedAttributeLinks = await ctx.prisma.attributeLinkRedeem.findMany({
    where: {
      memberUserId: userId,
    },
    include: {
      link: true,
    },
  });

  return {
    attendedMeetings,
    redeemedAttendanceLinks,
    redeemedAttributeLinks,
    member,
  };
};
