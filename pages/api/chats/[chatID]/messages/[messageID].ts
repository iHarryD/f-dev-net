import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../../lib/mongodb";
import { nextAuthConfig } from "../../../auth/[...nextauth]";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: "http://localhost:3000",
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  func: (req: NextApiRequest, res: NextApiResponse, callback: any) => any
) {
  return new Promise((resolve, reject) => {
    func(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  const { chatID, messageID } = req.query;
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return res.status(401).json({ message: "Private" });
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "PATCH":
        const { newMessage } = req.body;
        connection.clientPromise = await (await connectToMongoDb).connect();
        const editedMessage = await connection.clientPromise
          .db()
          .collection("chats")
          .updateOne(
            {
              $and: [
                { _id: new ObjectId(chatID as string) },
                { "chatBetween.username": { $in: [session.user.username] } },
                { "conversation._id": new ObjectId(messageID as string) },
              ],
            },
            { $set: { "conversation.$.message": newMessage } }
          );
        return res
          .status(200)
          .json({ message: "Message edited.", data: editedMessage });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const deletedMessage = await connection.clientPromise
          .db()
          .collection("chats")
          .updateOne(
            {
              $and: [
                { _id: new ObjectId(chatID as string) },
                { "chatBetween.username": { $in: [session.user.username] } },
              ],
            },
            {
              $pull: {
                "conversation._id": new ObjectId(messageID as string),
              },
            }
          );
        return res
          .status(200)
          .json({ message: "Message deleted.", data: deletedMessage });
      default:
        return res.status(405).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong.", data: err });
  }
}
