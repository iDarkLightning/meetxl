import { AttendanceLinkAction } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import {
  meetingAdminProcedure,
  meetingMemberProcedure,
} from "../../procedures/meeting-procedures";
import { t } from "../../trpc";

export const meetingAttendanceLinkRouter = t.router({
  list: meetingAdminProcedure
    .input(z.object({ action: z.nativeEnum(AttendanceLinkAction) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attendanceLink.findMany({
        where: {
          meetingId: ctx.meeting.id,
          action: input.action,
        },
      });
    }),

  create: meetingAdminProcedure
    .input(z.object({ action: z.nativeEnum(AttendanceLinkAction) }))
    .mutation(async ({ ctx, input }) => {
      if (input.action === "CHECKIN" && !ctx.meeting.requireCheckIn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Check-in is not enabled for this meeting.",
        });
      } else if (input.action === "CHECKOUT" && !ctx.meeting.requireCheckOut) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Check-out is not enabled for this meeting.",
        });
      }

      return ctx.prisma.attendanceLink.create({
        data: {
          meetingId: ctx.meeting.id,
          code: randomBytes(3).toString("hex"),
          action: input.action,
        },
      });
    }),

  apply: meetingMemberProcedure
    .input(z.object({ code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.prisma.attendanceLink.findUniqueOrThrow({
        where: {
          meetingId_code: {
            meetingId: ctx.meeting.id,
            code: input.code,
          },
        },
      });

      if (link.action === "CHECKIN") {
        return ctx.prisma.meetingParticipant.update({
          where: {
            meetingId_memberOrganizationId_memberUserId: {
              meetingId: ctx.meeting.id,
              memberOrganizationId: ctx.org.id,
              memberUserId: ctx.session.user.id,
            },
          },
          data: {
            status: ctx.meeting.requireCheckOut ? "REGISTERED" : "ATTENDED",
            checkedIn: true,
            checkInTime: new Date(),
          },
        });
      } else if (link.action === "CHECKOUT") {
      }
    }),

  delete: meetingAdminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.attendanceLink.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
