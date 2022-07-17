import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../lib/mongodb";
import { nextAuthConfig } from "../../auth/[...nextauth]";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";

const cors = Cors({
  methods: ["POST", "DELETE"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const { postID } = req.body;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session === null) return res.status(401).json({ message: "Private" });
    switch (method) {
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const bookmarkedPost = await connection.clientPromise
          .db()
          .collection("users")
          .updateOne(
            { username: session.user.username },
            { $addToSet: { savedPosts: postID } }
          );
        return res
          .status(200)
          .json({ message: "Post bookmarked.", data: bookmarkedPost });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        await connection.clientPromise
          .db()
          .collection("users")
          .updateOne(
            { username: session.user.username },
            { $pull: { savedPosts: postID } }
          );
        return res
          .status(200)
          .json({ message: "Post removed from bookmarks.", data: null });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
