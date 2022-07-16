import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../lib/mongodb";
import { nextAuthConfig } from "../auth/[...nextauth]";
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
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return res.status(401).json({ message: "Private" });
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "POST":
        const { sendTo, message } = req.body;
        if (sendTo === undefined || message === undefined)
          throw new Error("Invalid message body.");
        const completeMessage = {
          _id: new ObjectId(),
          message,
          sender: session.user.username,
          receiver: sendTo,
          timestamp: new Date(),
        };
        connection.clientPromise = await (await connectToMongoDb).connect();
        const sendToUser = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: sendTo });
        if (sendToUser === null)
          return res.status(404).json({ message: "User not found." });
        const doesChatAlreadyExists = await connection.clientPromise
          .db()
          .collection("chats")
          .findOne({ chatBetween: { $all: [session.user.username, sendTo] } });
        if (doesChatAlreadyExists)
          return res
            .status(500)
            .json({ message: "Chat already exists.", data: null });
        await connection.clientPromise
          .db()
          .collection("chats")
          .insertOne({
            chatBetween: [
              {
                username: sendToUser.username,
                name: sendToUser.name,
                image: sendToUser.image,
              },
              {
                username: session.user.username,
                name: session.user.name,
                image: session.user.image,
              },
            ],
            conversation: [completeMessage],
            timestamp: new Date(),
          });
        return res
          .status(200)
          .json({ message: "Message sent.", data: completeMessage });
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
