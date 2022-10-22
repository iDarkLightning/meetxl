import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import {
  meetingAdminProcedure,
  meetingMemberProcedure,
} from "../../procedures/meeting-procedures";
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
                code: randomBytes(3).toString("hex"),
                meetingId: ctx.meeting.id,
                memberUserId: memberId,
                memberOrganizationId: ctx.org.id,
                status: "REGISTERED",
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

  register: meetingMemberProcedure.mutation(async ({ ctx }) => {
    const participantCount = await ctx.prisma.meetingParticipant.count({
      where: {
        meetingId: ctx.meeting.id,
      },
    });

    if (
      ctx.meeting.maxParticipants &&
      participantCount >= ctx.meeting.maxParticipants
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Maximum number of participants reached",
      });
    }

    return ctx.prisma.meetingParticipant.create({
      data: {
        code: randomBytes(3).toString("hex"),
        meetingId: ctx.meeting.id,
        memberUserId: ctx.session.user.id,
        memberOrganizationId: ctx.org.id,
        status: "REGISTERED",
      },
    });
  }),

  leave: meetingMemberProcedure.mutation(async ({ ctx }) => {
    if (!ctx.meeting.isPublic)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot leave a public meeting",
      });

    return ctx.prisma.meetingParticipant.delete({
      where: {
        meetingId_memberOrganizationId_memberUserId: {
          meetingId: ctx.meeting.id,
          memberOrganizationId: ctx.org.id,
          memberUserId: ctx.session.user.id,
        },
      },
    });
  }),

  toggleLimit: meetingAdminProcedure.mutation(async ({ ctx }) => {
    const participantCount = await ctx.prisma.meetingParticipant.count({
      where: {
        meetingId: ctx.meeting.id,
      },
    });

    return ctx.prisma.meeting.update({
      where: {
        id: ctx.meeting.id,
      },
      data: {
        limitParticipants: !ctx.meeting.limitParticipants,
        maxParticipants: ctx.meeting.limitParticipants
          ? null
          : participantCount,
      },
    });
  }),

  updateLimit: meetingAdminProcedure
    .input(z.object({ limit: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const participantCount = await ctx.prisma.meetingParticipant.count({
        where: {
          meetingId: ctx.meeting.id,
        },
      });

      if (input.limit < participantCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot set limit lower than current participant count",
        });
      }

      return ctx.prisma.meeting.update({
        where: {
          id: ctx.meeting.id,
        },
        data: {
          maxParticipants: input.limit,
        },
      });
    }),
});
