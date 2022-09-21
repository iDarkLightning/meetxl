// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import { type NextAuthOptions, unstable_getServerSession } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
