import { orgAdminProcedure } from "../../procedures/org-procedures";
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
});
