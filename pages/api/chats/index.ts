import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import verifyToken from "../../../helpers/verifyToken";
import { RequestWithUser } from "../../../interfaces/Common.type";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
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
      case "POST":
        const { sendTo, message } = req.body;
        if (sendTo === undefined || message === undefined)
          throw new Error("Invalid message body.");
        const completeMessage = {
          _id: new ObjectId(),
          message,
          sender: new ObjectId(req.user),
          receiver: sendTo,
          timestamp: new Date(),
        };
        connection.clientPromise = await (await connectToMongoDb).connect();
        const doesChatAlreadyExists = await connection.clientPromise
          .db()
          .collection("chats")
          .findOne({
            $and: [
              { "chatBetween.username": { $in: [req.user] } },
              { "chatBetween.username": { $in: [sendTo] } },
            ],
          });
        if (doesChatAlreadyExists)
          return res
            .status(500)
            .json({ message: "Chat already exists.", data: null });
        const user = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: req.user });
        const sendToUser = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: sendTo });
        if (sendToUser === null || user === null)
          return res.status(404).json({ message: "User not found." });
        await connection.clientPromise
          .db()
          .collection("chats")
          .insertOne({
            chatBetween: [
              {
                username: user.username,
                name: user.name,
                image: user.image,
              },
              {
                username: sendToUser.username,
                name: sendToUser.name,
                image: sendToUser.image,
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
