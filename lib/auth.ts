import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatarColor: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.avatarColor = (user as { avatarColor: string }).avatarColor;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.avatarColor = token.avatarColor as string;
      return session;
    },
  },
});
