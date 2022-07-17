import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../../lib/mongodb";
import { nextAuthConfig } from "../../../auth/[...nextauth]";
import Cors from "cors";
import corsMiddleware from "../../../../../helpers/corsMiddleware";

const cors = Cors({
  methods: ["POST", "DELETE"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const { postID } = req.query;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session === null) return res.status(401).json({ message: "Private" });
    switch (method) {
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const likedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(postID as string) },
            { $addToSet: { likes: session.user.username } }
          );
        return res
          .status(200)
          .json({ message: "Post liked.", data: likedPost });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const unlikedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(postID as string) },
            { $pull: { likes: session.user.username } }
          );
        return res
          .status(200)
          .json({ message: "Post unliked.", data: unlikedPost });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
