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
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return res.status(401).json({ message: "Private" });
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
                  postedBy: session.user.username,
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
