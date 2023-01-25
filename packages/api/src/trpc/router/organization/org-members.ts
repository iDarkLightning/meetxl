import { getMemberInsights } from "../../../common/get-member-insights";
import { z } from "zod";
import {
  orgAdminProcedure,
  orgMemberProcedure,
} from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgMembersRouter = t.router({
  list: orgAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.organizationMember.findMany({
      where: {
        organizationId: ctx.org.id,
      },
      include: {
        user: true,
      },
    });
  }),

  kick: orgAdminProcedure
    .input(z.object({ memberId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.organizationMember.delete({
        where: {
          organizationId_userId: {
            organizationId: ctx.org.id,
            userId: input.memberId,
          },
        },
      });
    }),

  getInsights: orgMemberProcedure.query(async ({ ctx }) => {
    return getMemberInsights(ctx, ctx.session.user.id);
  }),

  getInsightsFor: orgAdminProcedure
    .input(z.object({ memberId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return getMemberInsights(ctx, input.memberId);
    }),
});
