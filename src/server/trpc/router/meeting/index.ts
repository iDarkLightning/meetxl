import {
  createMeetingSchema,
  updateMeetingSchema,
} from "@/lib/schemas/meeting-schemas";
import { TRPCError } from "@trpc/server";
import { Context } from "../../context";
import {
  meetingAdminProcedure,
  meetingMemberProcedure,
} from "../../procedures/meeting-procedures";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";
import { meetingAttendanceRouter } from "./meeting-attendance";
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
    .input(createMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.startTime.getTime() > input.endTime.getTime()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Start time must be before end time",
        });
      }

      return ctx.prisma.meeting.create({
        data: {
          name: input.name,
          slug: await generateMeetingSlug(input.name, ctx),
          organizationSlug: ctx.org.slug,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      });
    }),

  update: meetingAdminProcedure
    .input(updateMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.startTime.getTime() > input.endTime.getTime()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Start time must be before end time",
        });
      }

      return ctx.prisma.meeting.update({
        where: { id: ctx.meeting.id },
        data: {
          name: input.name,
          location: input.location,
          startTime: input.startTime,
          endTime: input.endTime,
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
        organization: {
          id: ctx.org.id,
        },
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

  get: meetingMemberProcedure.query(async ({ ctx }) => {
    const participant = await ctx.prisma.meetingParticipant.findUnique({
      where: {
        meetingId_memberOrganizationId_memberUserId: {
          meetingId: ctx.meeting.id,
          memberOrganizationId: ctx.org.id,
          memberUserId: ctx.session.user.id,
        },
      },
    });

    if (ctx.meeting.isPublic && !participant)
      return { ...ctx.meeting, participant: null };

    return { ...ctx.meeting, participant };
  }),

  toggleAccess: meetingAdminProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.meeting.update({
      where: {
        organizationSlug_slug: {
          organizationSlug: ctx.org.slug,
          slug: ctx.meeting.slug,
        },
      },
      data: {
        isPublic: !ctx.meeting.isPublic,
      },
    });
  }),

  delete: meetingAdminProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.meeting.delete({
      where: {
        id: ctx.meeting.id,
      },
    });
  }),

  reward: meetingRewardRouter,
  participant: meetingParticipantRouter,
  attendance: meetingAttendanceRouter,
});
