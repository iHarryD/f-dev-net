import { MongoClient, ObjectId, PullOperator } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import verifyToken from "../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../interfaces/Common.type";
import { uploadImage } from "../../../../cloudinary";
import { PostCategories } from "../../../../interfaces/Common.interface";

const cors = Cors({
  methods: ["GET", "DELETE", "PATCH"],
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
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const requestedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .findOne({ _id: new ObjectId(postID as string) });
        return res
          .status(200)
          .json({ message: "Post fetched.", data: requestedPost });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        await connection.clientPromise
          .db()
          .collection("posts")
          .deleteOne({
            _id: new ObjectId(postID as string),
            "postedBy.username": req.user,
          });
        await connection.clientPromise
          .db()
          .collection("bookmarks")
          .updateMany(
            { savedPosts: { $in: [postID] } },
            { $pull: { savedPosts: postID } as PullOperator<Document> }
          );
        return res.status(200).json({ message: "Post deleted.", data: null });
      case "PATCH":
        const updateQuery: {
          caption?: string;
          category?: PostCategories;
          media?: string | null;
        } = {};
        if (req.body.caption) {
          updateQuery.caption = req.body.caption;
        }
        if (req.body.category) {
          updateQuery.category = req.body.category;
        }
        if (req.body.media || req.body.media === null) {
          if (req.body.media) {
            const publicID = await uploadImage(req.body.media);
            updateQuery.media = publicID.secure_url;
          } else {
            updateQuery.media = null;
          }
        }
        connection.clientPromise = await (await connectToMongoDb).connect();
        const updatedPost = await connection.clientPromise
          .db()
          .collection("posts")
          .findOneAndUpdate(
            {
              _id: new ObjectId(postID as string),
              "postedBy.username": req.user,
            },
            { $set: { ...updateQuery, lastModified: new Date() } },
            { returnDocument: "after" }
          );
        return res
          .status(200)
          .json({ message: "Post updated.", data: updatedPost.value });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
