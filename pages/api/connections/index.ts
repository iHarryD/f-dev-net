import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import { RequestWithUser } from "../../../interfaces/Common.type";
import verifyToken from "../../../helpers/verifyToken";

const cors = Cors({
  methods: ["GET", "POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    connection.clientPromise = await (await connectToMongoDb).connect();
    switch (method) {
      case "GET":
        const allConnections = connection.clientPromise
          .db()
          .collection("connections")
          .find({
            connectionBetween: { $in: [req.user] },
          });
        return res.status(200).json({
          message: "Connections fetched",
          data: await cursorToDoc(allConnections),
        });
      case "POST":
        await connection.clientPromise
          .db()
          .collection("connections")
          .insertOne({
            connectionBetween: [req.user, req.body.otherUser],
            isActive: false,
            initiatedBy: req.user,
            timestamp: new Date(),
          });
        return res
          .status(200)
          .json({ message: "Connection initiated.", data: null });
      default:
        return res.status(405).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error", data: err });
  }
}
