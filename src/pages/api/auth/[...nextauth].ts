import NextAuth from "next-auth";

import { authOptions } from "@/server/common/get-server-auth-session";

export default NextAuth(authOptions);
