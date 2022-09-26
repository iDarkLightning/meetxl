import { z } from "zod";
import { orgAdminProcedure } from "./org-procedures";

export const meetingAdminProcedure = orgAdminProcedure
  .input(z.object({ meetingId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const meeting = await ctx.prisma.meeting.findFirstOrThrow({
      where: {
        OR: [{ id: input.meetingId }, { slug: input.meetingId }],
        organizationSlug: ctx.org.slug,
      },
    });

    return next({ ctx: { meeting } });
  });
