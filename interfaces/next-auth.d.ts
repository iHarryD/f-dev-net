import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      badges: string[];
      bio: string;
      connections: string[];
      posts: string[];
      username: string;
    } & DefaultSession["user"];
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
