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

  get: meetingMemberProcedure
    .input(
      z.object({ type: z.nativeEnum(AttendanceLinkAction), code: z.string() })
    )
    .query(async ({ ctx, input }) => {
      if (
        (input.type === AttendanceLinkAction.CHECKIN &&
          !ctx.meeting.requireCheckIn) ||
        (input.type === AttendanceLinkAction.CHECKOUT &&
          !ctx.meeting.requireCheckOut)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This meeting does not have" + input.type + " enabled",
        });
      }

      return ctx.prisma.attendanceLink.findFirstOrThrow({
        where: {
          meetingId: ctx.meeting.id,
          action: input.type,
          code: input.code,
        },
      });
    }),

  listRedeem: meetingAdminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.attendanceLinkRedeem.findMany({
        where: {
          linkId: input.id,
        },
        select: {
          redeemedAt: true,
          participant: {
            include: {
              member: {
                select: {
                  user: true,
                },
              },
            },
          },
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
          issuer: {
            connect: {
              organizationId_userId: {
                organizationId: ctx.org.id,
                userId: ctx.session.user.id,
              },
            },
          },
          meeting: {
            connect: {
              id: ctx.meeting.id,
            },
          },
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

      const participant = await ctx.prisma.meetingParticipant.findUniqueOrThrow(
        {
          where: {
            meetingId_memberOrganizationId_memberUserId: {
              meetingId: ctx.meeting.id,
              memberOrganizationId: ctx.org.id,
              memberUserId: ctx.session.user.id,
            },
          },
        }
      );

      if (link.action === "CHECKIN") {
        await ctx.prisma.meetingParticipant.update({
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
        if (ctx.meeting.requireCheckIn && !participant.checkedIn) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Check-in is required before check-out.",
          });
        }

        await ctx.prisma.meetingParticipant.update({
          where: {
            meetingId_memberOrganizationId_memberUserId: {
              meetingId: ctx.meeting.id,
              memberOrganizationId: ctx.org.id,
              memberUserId: ctx.session.user.id,
            },
          },
          data: {
            status: "ATTENDED",
            checkedOut: true,
            checkOutTime: new Date(),
          },
        });
      }

      await ctx.prisma.attendanceLink.update({
        where: {
          id: link.id,
        },
        data: {
          redeemedBy: {
            create: {
              participant: {
                connect: {
                  meetingId_memberOrganizationId_memberUserId: {
                    meetingId: ctx.meeting.id,
                    memberOrganizationId: ctx.org.id,
                    memberUserId: ctx.session.user.id,
                  },
                },
              },
            },
          },
        },
      });
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
