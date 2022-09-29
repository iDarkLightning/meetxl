import { z } from "zod";
import { meetingAdminProcedure } from "../../procedures/meeting-procedures";
import { t } from "../../trpc";

export const meetingParticipantRouter = t.router({
  getRoster: meetingAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.organizationMember.findMany({
      where: {
        organizationId: ctx.org.id,
      },
      include: {
        user: true,
        meetings: {
          where: {
            meetingId: ctx.meeting.id,
          },
        },
      },
    });
  }),

  list: meetingAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.meetingParticipant.findMany({
      where: {
        meetingId: ctx.meeting.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
  }),

  update: meetingAdminProcedure
    .input(z.object({ members: z.array(z.string().cuid()) }))
    .mutation(async ({ ctx, input }) => {
      const participants = (
        await ctx.prisma.meetingParticipant.findMany({
          where: {
            meetingId: ctx.meeting.id,
          },
          select: {
            memberUserId: true,
          },
        })
      ).map((p) => p.memberUserId);

      return ctx.prisma.$transaction(
        input.members.map((memberId) => {
          if (!participants.includes(memberId)) {
            return ctx.prisma.meetingParticipant.create({
              data: {
                meetingId: ctx.meeting.id,
                memberUserId: memberId,
                memberOrganizationId: ctx.org.id,
                status: "ASSIGNED",
              },
            });
          }

          return ctx.prisma.meetingParticipant.delete({
            where: {
              meetingId_memberOrganizationId_memberUserId: {
                meetingId: ctx.meeting.id,
                memberOrganizationId: ctx.org.id,
                memberUserId: memberId,
              },
            },
          });
        })
      );
    }),
});
