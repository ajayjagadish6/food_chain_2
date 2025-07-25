import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the session and user types to include id and role

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
