import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { UserWithStats } from "./Common.interface";

declare module "next-auth" {
  interface Session {
    user: UserWithStats;
  }
  interface User {
    bio: string;
    createdAt: Date;
    username: string;
    savedPosts: string[];
  }
  interface Profile {
    login: string;
  }
}
