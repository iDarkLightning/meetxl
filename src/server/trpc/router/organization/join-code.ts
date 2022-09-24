import { MemberRole } from "@prisma/client";
import { randomBytes } from "crypto";
import { z } from "zod";
import { orgAdminProcedure } from "../../procedures/org-procedures";
import { t } from "../../trpc";

export const orgJoinCodeRouter = t.router({
  create: orgAdminProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.joinCode.create({
      data: {
        organization: {
          connect: {
            id: ctx.org.id,
          },
        },
        issuer: {
          connect: {
            organizationId_userId: {
              organizationId: ctx.org.id,
              userId: ctx.session.user.id,
            },
          },
        },
        code: randomBytes(4).toString("hex"),
        role: MemberRole.MEMBER,
      },
    });
  }),

  list: orgAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.joinCode.findMany({
      where: {
        organizationId: ctx.org.id,
      },
      include: {
        issuer: {
          select: {
            user: true,
          },
        },
      },
    });
  }),

  changeRole: orgAdminProcedure
    .input(z.object({ id: z.string().cuid(), role: z.nativeEnum(MemberRole) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.joinCode.update({
        where: {
          id: input.id,
        },
        data: {
          role: input.role,
        },
      });
    }),

  revoke: orgAdminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.joinCode.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
