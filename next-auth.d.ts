// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import { Profile } from "./types"; 

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & Profile & DefaultSession["user"];
  }

  interface User {
    id: string;
    randomKey?: string;
    lastName?: string;
    username?: string;
    country?: string;
  }

  interface JWT {
    id: string;
    randomKey?: string;
    lastName?: string;
    username?: string;
    country?: string;
  }
}
