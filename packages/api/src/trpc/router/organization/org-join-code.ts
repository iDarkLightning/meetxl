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
        code: randomBytes(3).toString("hex"),
        role: "MEMBER",
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
    .input(z.object({ id: z.string().cuid(), role: z.string() }))
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

  get: authedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const joinCode = await ctx.prisma.joinCode.findUniqueOrThrow({
        where: {
          code: input.code,
        },
        include: {
          organization: true,
        },
      });

      const orgMember = await ctx.prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: joinCode.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (orgMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already a member of this organization",
        });
      }

      return joinCode;
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
          slug: true,
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

      await ctx.prisma.$transaction([
        ctx.prisma.joinCode.update({
          where: { code: input.code },
          data: { uses: { increment: 1 } },
        }),

        ctx.prisma.organizationMember.create({
          data: {
            organizationId: organization.id,
            userId: ctx.session.user.id,
            role: organization.joinCodes[0].role,
          },
        }),

        ...organization.attributes.map((attribute) =>
          ctx.prisma.memberAttribute.create({
            data: {
              orgId: organization.id,
              userId: ctx.session.user.id,
              organizationAttributeName: attribute.name,
              value: 0,
            },
          })
        ),
      ]);

      return { slug: organization.slug };
    }),
});
