import { Meeting, Organization } from "@prisma/client";
import { Context } from "../trpc/context";

export const grantRewards = async (
  ctx: Context & { meeting: Meeting; org: Organization },
  userId: string
) => {
  const rewards = await ctx.prisma.meetingReward.findMany({
    where: {
      meetingId: ctx.meeting.id,
    },
  });

  return ctx.prisma.$transaction(
    rewards.map((reward) =>
      ctx.prisma.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: ctx.org.id,
            userId,
          },
        },
        data: {
          attributes: {
            update: {
              where: {
                organizationAttributeName_orgId_userId: {
                  organizationAttributeName: reward.attributeName,
                  orgId: ctx.org.id,
                  userId,
                },
              },
              data: {
                value: {
                  [reward.action === "SET" ? "set" : "increment"]:
                    reward.action === "DECREMENT"
                      ? -reward.value
                      : reward.value,
                },
              },
            },
          },
        },
      })
    )
  );
};
