import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDB from "../../../lib/mongodb";
import { MongoClient } from "mongodb";
import { unstable_getServerSession } from "next-auth";
import { nextAuthConfig } from "../auth/[...nextauth]";
import connectToMongoDb from "../../../lib/mongodb";
import { cursorToDoc } from "../../../helpers/cursorToDoc";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null)
    return res
      .status(401)
      .json({ message: "You are not authenticated.", data: null });
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const userDoc = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: session.user.username });
        if (userDoc === null) throw new Error("User not found.");
        const badges = connection.clientPromise
          .db()
          .collection("badges")
          .find({ givenTo: session.user.username });
        const connections = connection.clientPromise
          .db()
          .collection("connections")
          .find({ connectionBetween: { $in: [session.user.username] } });
        const posts = connection.clientPromise
          .db()
          .collection("posts")
          .find({ postedBy: { username: session.user.username } });
        const userDetails = {
          badges: await cursorToDoc(badges),
          connections: await cursorToDoc(connections),
          posts: await cursorToDoc(posts),
          ...(await cursorToDoc(userDoc)),
        };
        return res
          .status(200)
          .json({ message: "User fetched.", data: userDetails });
      case "PATCH":
        const { name, bio } = req.body;
        connection.clientPromise = await (await connectToMongoDB).connect();
        const updatedUser = await connection.clientPromise
          .db()
          .collection("users")
          .updateOne(
            { username: session.user.username },
            {
              $set: {
                name: name,
                bio: bio,
              },
            }
          );
        return res.json({ message: "Profile updated.", data: updatedUser });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
}
