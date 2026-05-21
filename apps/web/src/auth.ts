import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@nursenest/types";
import type { ApiResponse, LoginResponseDto } from "@nursenest/types";

declare module "next-auth" {
  interface User {
    role: Role;
    accessToken?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
    };
    accessToken?: string;
  }
}

const internalApi = process.env["INTERNAL_API_URL"] ?? "http://localhost:3001";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${internalApi}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const json = (await res.json()) as ApiResponse<LoginResponseDto>;
        if (!json.success) return null;

        return {
          id: json.data.user.id,
          email: json.data.user.email,
          role: json.data.user.role,
          accessToken: json.data.accessToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["id"] = user.id;
        token["role"] = user.role;
        token["accessToken"] = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token["id"] as string;
        session.user.role = token["role"] as Role;
        session.accessToken = token["accessToken"] as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env["AUTH_SECRET"],
});
