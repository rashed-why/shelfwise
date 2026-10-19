import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  fetchAuthenticatedUser,
  loginWithCredentials,
} from "@/lib/auth-api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/next-auth",
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access token", type: "text" },
        refreshToken: { label: "Refresh token", type: "text" },
      },
      async authorize(credentials) {
        const accessToken = credentials?.accessToken as string | undefined;
        const refreshToken = credentials?.refreshToken as string | undefined;

        if (accessToken && refreshToken) {
          try {
            const user = await fetchAuthenticatedUser(accessToken);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              accessToken,
              refreshToken,
            };
          } catch {
            return null;
          }
        }

        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        try {
          const result = await loginWithCredentials(email, password);
          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },
  },
});
