import NextAuth from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { authOptions } from "@/server/common/get-server-auth-session";

export default NextAuth(authOptions);
