import { createMeetingRewardSchema } from "@/lib/schemas/meeting-schemas";
import { AttributeModifierAction } from "@prisma/client";
import { z } from "zod";
import {
  meetingAdminProcedure,
  meetingMemberProcedure,
} from "../../procedures/meeting-procedures";
import { t } from "../../trpc";

export const meetingRewardRouter = t.router({
  toggle: meetingAdminProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.meeting.update({
      where: {
        id: ctx.meeting.id,
      },
      data: {
        rewardsEnabled: !ctx.meeting.rewardsEnabled,
      },
    });
  }),

  create: meetingAdminProcedure
    .input(createMeetingRewardSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meetingReward.create({
        data: {
          attribute: {
            connect: {
              name_organizationId: {
                name: input.key,
                organizationId: ctx.org.id,
              },
            },
          },
          meeting: {
            connect: {
              id: ctx.meeting.id,
            },
          },
          value: input.value,
          action: input.action,
        },
      });
    }),

  list: meetingMemberProcedure.query(async ({ ctx }) => {
    return ctx.prisma.meetingReward.findMany({
      where: {
        meetingId: ctx.meeting.id,
      },
      orderBy: {
        value: "asc",
      },
    });
  }),

  delete: meetingAdminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meetingReward.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
