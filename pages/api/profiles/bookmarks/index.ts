import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import verifyToken from "../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../interfaces/Common.type";

const cors = Cors({
  methods: ["POST", "DELETE"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const { postID } = req.body;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const bookmarkedPost = await connection.clientPromise
          .db()
          .collection("users")
          .updateOne(
            { username: req.user },
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
          .updateOne({ username: req.user }, { $pull: { savedPosts: postID } });
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
