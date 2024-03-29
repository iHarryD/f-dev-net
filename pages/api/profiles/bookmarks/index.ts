import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import verifyToken from "../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../interfaces/Common.type";
import { cursorToDoc } from "../../../../helpers/cursorToDoc";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
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
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const bookmark = await connection.clientPromise
          .db()
          .collection("bookmarks")
          .findOne({ belongsTo: req.user });
        if (bookmark) {
          const allBookmarkedPostsID = bookmark.savedPosts.map(
            (id: string) => new ObjectId(id)
          );
          const allBookmarkedPosts = connection.clientPromise
            .db()
            .collection("posts")
            .find({ _id: { $in: allBookmarkedPostsID } });
          return res.status(200).json({
            message: "Bookmarked posts fetched.",
            data: await cursorToDoc(allBookmarkedPosts),
          });
        } else {
          return res.status(200).json({
            message: "Bookmarked posts fetched.",
            data: [],
          });
        }
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const bookmarkedPost = await connection.clientPromise
          .db()
          .collection("bookmarks")
          .updateOne(
            { belongsTo: req.user },
            { $addToSet: { savedPosts: postID } },
            { upsert: true }
          );
        return res
          .status(200)
          .json({ message: "Post bookmarked.", data: bookmarkedPost });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        await connection.clientPromise
          .db()
          .collection("bookmarks")
          .updateOne(
            { belongsTo: req.user },
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
    return res
      .status(500)
      .json({ message: "Something went wrong.", data: err });
  }
}
