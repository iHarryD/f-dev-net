import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../lib/mongodb";
import { nextAuthConfig } from "../../auth/[...nextauth]";
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
  const { chatID } = req.query;
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
        await connection.clientPromise
          .db()
          .collection("chats")
          .updateOne(
            {
              _id: new ObjectId(chatID as string),
              $and: [
                { "chatBetween.username": { $in: [session.user.username] } },
                { "chatBetween.username": { $in: [sendTo] } },
              ],
            },
            { $push: { conversation: completeMessage } }
          );
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
