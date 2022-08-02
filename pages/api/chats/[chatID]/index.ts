import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import verifyToken from "../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../interfaces/Common.type";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const { chatID } = req.query;
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
          sender: req.user,
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
                { "chatBetween.username": { $in: [req.user] } },
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
