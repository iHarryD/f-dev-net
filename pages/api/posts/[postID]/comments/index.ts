import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../../lib/mongodb";
import { nextAuthConfig } from "../../../auth/[...nextauth]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session === null) return res.status(401).json({ message: "Private" });
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const post = await connection.clientPromise
          .db()
          .collection("posts")
          .findOne({ _id: new ObjectId(req.query.postID as string) });
        if (post === null)
          return res
            .status(404)
            .json({ message: "Post not found.", data: null });
        return res
          .status(200)
          .json({ message: "Comments fetched.", data: post.comments });
      case "POST":
        const { comment } = req.body;
        connection.clientPromise = await (await connectToMongoDb).connect();
        const newComment = await connection.clientPromise
          .db()
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(req.query.postID as string) },
            {
              $push: {
                comments: {
                  comment,
                  postedBy: session.user.username,
                  timestamp: new Date(),
                  _id: new ObjectId(),
                },
              },
            }
          );
        if (newComment.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Comment added.", data: newComment });
        } else {
          return res
            .status(300)
            .json({ message: "Could not add comment.", data: null });
        }
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
