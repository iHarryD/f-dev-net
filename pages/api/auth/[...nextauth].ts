import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import clientPromise from "../../../lib/mongodb";

export const nextAuthConfig: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_ID!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      user.username = profile.login.toLowerCase();
      user.bio = "";
      user.savedPosts = [];
      user.createdAt = new Date();
      return true;
    },
    async session({ session, user, token }) {
      const connection = await (await clientPromise).connect();
      const badges = connection
        .db()
        .collection("badges")
        .find({ givenTo: user.username });
      const connections = connection
        .db()
        .collection("connections")
        .find({
          $and: [
            { connectionBetween: { $in: [user.username] } },
            { isActive: true },
          ],
        });
      const posts = connection
        .db()
        .collection("posts")
        .find({ "postedBy.username": user.username });
      connections.close();
      session.user.badges = await cursorToDoc(badges);
      session.user.bio = user.bio;
      session.user.connections = await cursorToDoc(connections);
      session.user.posts = await cursorToDoc(posts);
      session.user.username = user.username;
      session.user.savedPosts = user.savedPosts;
      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, nextAuthConfig);
