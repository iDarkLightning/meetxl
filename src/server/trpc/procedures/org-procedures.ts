import { z } from "zod";
import { authedProcedure } from "./authed-procedure";

export const orgMemberProcedure = authedProcedure
  .input(z.object({ orgId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const org = await ctx.prisma.organization.findFirstOrThrow({
      where: {
        AND: [
          {
            OR: [{ id: input.orgId }, { slug: input.orgId }],
          },
          {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
    });

    return next({ ctx: { org } });
  });
