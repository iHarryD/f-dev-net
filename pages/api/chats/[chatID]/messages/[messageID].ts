import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../../lib/mongodb";
import Cors from "cors";
import { RequestWithUser } from "../../../../../interfaces/Common.type";
import corsMiddleware from "../../../../../helpers/corsMiddleware";
import verifyToken from "../../../../../helpers/verifyToken";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const { chatID, messageID } = req.query;
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
                { "chatBetween.username": { $in: [req.user] } },
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
                { "chatBetween.username": { $in: [req.user] } },
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
