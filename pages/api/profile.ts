import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDB from "../../lib/mongodb";
import { MongoClient } from "mongodb";
import { unstable_getServerSession } from "next-auth";
import { nextAuthConfig } from "./auth/[...nextauth]";
import connectToMongoDb from "../../lib/mongodb";
import { cursorToDoc } from "../../helpers/cursorToDoc";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const connectionPromise: { connection: null | MongoClient } = {
    connection: null,
  };
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { user } = req.query;
        const username =
          user ||
          (await unstable_getServerSession(req, res, nextAuthConfig))?.user
            .username;
        if (!username) throw new Error();
        connectionPromise.connection = await (await connectToMongoDb).connect();
        const userDoc = await connectionPromise.connection
          .db()
          .collection("users")
          .findOne({ username });
        if (userDoc === null) throw new Error();
        const badges = connectionPromise.connection
          .db()
          .collection("badges")
          .find({ givenTo: username });
        const connections = connectionPromise.connection
          .db()
          .collection("connections")
          .find({ connectionBetween: { $in: [username] } });
        const posts = connectionPromise.connection
          .db()
          .collection("posts")
          .find({ postedBy: { username: username } });
        const userDetails = {
          badges: await cursorToDoc(badges),
          connections: await cursorToDoc(connections),
          posts: await cursorToDoc(posts),
          ...(await cursorToDoc(userDoc)),
        };
        return res
          .status(200)
          .json({ message: "User fetched.", data: userDetails });
      } catch (err) {
        return res.status(500).send(err);
      } finally {
        if (connectionPromise.connection) {
          connectionPromise.connection.close();
        }
      }
    case "PATCH":
      const session = await unstable_getServerSession(req, res, nextAuthConfig);
      if (session === null) return;
      const { name, bio } = req.body;
      try {
        connectionPromise.connection = await (await connectToMongoDB).connect();
        const updatedUser = await connectionPromise.connection
          .db()
          .collection("users")
          .findOneAndUpdate(
            { username: session.user.username },
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
        if (connectionPromise.connection) {
          connectionPromise.connection.close();
        }
      }
    default:
      return res
        .status(404)
        .json({ message: "Requested method is not allowed at this endpoint." });
  }
}
