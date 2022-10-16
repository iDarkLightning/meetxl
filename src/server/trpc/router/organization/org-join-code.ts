import { MemberRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { authedProcedure } from "../../procedures/authed-procedure";
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

  accept: authedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findFirstOrThrow({
        where: {
          joinCodes: {
            some: {
              code: input.code,
            },
          },
        },
        select: {
          id: true,
          joinCodes: {
            where: {
              code: input.code,
            },
            select: {
              role: true,
            },
            take: 1,
          },
          attributes: true,
        },
      });

      if (!organization.joinCodes[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid join code",
        });
      }

      return ctx.prisma.organization.update({
        where: { id: organization.id },
        data: {
          members: {
            create: {
              role: organization.joinCodes[0].role,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              attributes: {
                createMany: {
                  data: organization.attributes.map((attribute) => ({
                    organizationAttributeName: attribute.name,
                    value: 0,
                  })),
                },
              },
            },
          },
          joinCodes: {
            update: {
              where: { code: input.code },
              data: {
                uses: {
                  increment: 1,
                },
              },
            },
          },
        },
      });
    }),
});
