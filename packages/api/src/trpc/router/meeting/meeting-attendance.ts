import { grantRewards } from "../../../common/grant-rewards";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { meetingAdminProcedure } from "../../procedures/meeting-procedures";
import { t } from "../../trpc";
import { meetingAttendanceLinkRouter } from "./meeting-attendance-link";

export const meetingAttendanceRouter = t.router({
  toggleChecking: meetingAdminProcedure
    .input(z.object({ action: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meeting.update({
        where: {
          id: ctx.meeting.id,
        },
        data: {
          requireCheckIn:
            input.action === "CHECKIN"
              ? !ctx.meeting.requireCheckIn
              : ctx.meeting.requireCheckIn,
          requireCheckOut:
            input.action === "CHECKOUT"
              ? !ctx.meeting.requireCheckOut
              : ctx.meeting.requireCheckOut,
        },
      });
    }),

  checkIn: meetingAdminProcedure
    .input(z.object({ code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.meeting.requireCheckIn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Check-in is not enabled for this meeting.",
        });
      }

      const status = !ctx.meeting.requireCheckOut ? "ATTENDED" : "REGISTERED";

      const result = await ctx.prisma.meetingParticipant.update({
        where: {
          meetingId_code: {
            meetingId: ctx.meeting.id,
            code: input.code,
          },
        },
        data: {
          status,
          checkedIn: true,
          checkInTime: new Date(),
        },
      });

      if (status === "ATTENDED") {
        grantRewards(ctx, result.memberUserId);
      }

      return result;
    }),

  checkOut: meetingAdminProcedure
    .input(z.object({ code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.meeting.requireCheckOut) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Check-Out is not enabled for this meeting.",
        });
      }

      const participant = await ctx.prisma.meetingParticipant.findUniqueOrThrow(
        {
          where: {
            meetingId_code: {
              meetingId: ctx.meeting.id,
              code: input.code,
            },
          },
        }
      );

      if (ctx.meeting.requireCheckIn && !participant.checkedIn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Check-in is required before check-out.",
        });
      }

      const result = await ctx.prisma.meetingParticipant.update({
        where: {
          meetingId_code: {
            meetingId: ctx.meeting.id,
            code: input.code,
          },
        },
        data: {
          status: "ATTENDED",
          checkedOut: true,
          checkOutTime: new Date(),
        },
      });

      grantRewards(ctx, result.memberUserId);

      return result;
    }),

  links: meetingAttendanceLinkRouter,
});
