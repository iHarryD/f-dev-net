import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import corsMiddleware from "../../../../../helpers/corsMiddleware";
import verifyToken from "../../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../../interfaces/Common.type";
import connectToMongoDb from "../../../../../lib/mongodb";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "DELETE":
        const { commentID, postID } = req.query;
        connection.clientPromise = await (await connectToMongoDb).connect();
        const deletedComment = await connection.clientPromise
          .db()
          .collection("posts")
          .updateOne(
            {
              _id: new ObjectId(postID as string),
            },
            {
              $pull: {
                comments: {
                  _id: new ObjectId(commentID as string),
                  postedBy: req.user,
                },
              },
            }
          );
        if (deletedComment.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Comment deleted.", data: deletedComment });
        } else {
          return res
            .status(300)
            .json({ message: "Could not delete comment.", data: null });
        }
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
