import { MongoClient, ObjectId, PullOperator, SetFields } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../../helpers/corsMiddleware";
import verifyToken from "../../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../../interfaces/Common.type";

const cors = Cors({
  methods: ["POST", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const { postID } = req.query;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const likedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postID as string) },
            { $addToSet: { likes: req.user } as SetFields<Document> },
            { returnDocument: "after" }
          );
        return res
          .status(200)
          .json({ message: "Post liked.", data: likedPost.value });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const unlikedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .findOneAndUpdate(
            { _id: new ObjectId(postID as string) },
            { $pull: { likes: req.user } as PullOperator<Document> },
            { returnDocument: "after" }
          );
        return res
          .status(200)
          .json({ message: "Post unliked.", data: unlikedPost.value });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
