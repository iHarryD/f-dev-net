import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDB from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { nextAuthConfig } from "./auth/[...nextauth]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return;
  const username = session.user.username;
  const { method } = req;
  switch (method) {
    case "PATCH":
      const connection = await (await connectToMongoDB).connect();
      const { name, bio } = req.body;
      try {
        const updatedUser = await connection
          .db()
          .collection("users")
          .findOneAndUpdate(
            { username },
            {
              $set: {
                name: name,
                bio: bio,
              },
            },
            { returnDocument: "after" }
          );
        return res.json({ message: "Profile updated.", data: updatedUser });
      } catch (err) {
        return res.status(500).send(err);
      } finally {
        connection.close();
      }
    default:
      return res
        .status(404)
        .json({ message: "Requested method is not allowed at this endpoint." });
  }
}
