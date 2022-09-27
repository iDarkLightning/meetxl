import { meetingAdminProcedure } from "../../procedures/meeting-procedures";
import { t } from "../../trpc";

export const meetingParticipantRouter = t.router({
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
});
