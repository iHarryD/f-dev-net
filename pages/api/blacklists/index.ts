import { NextApiResponse } from "next";
import verifyToken from "../../../helpers/verifyToken";
import { RequestWithUser } from "../../../interfaces/Common.type";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import connectToMongoDb from "../../../lib/mongodb";
import { MongoClient } from "mongodb";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const {
    method,
    body: { otherUser },
  } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const allConnections = await connection.clientPromise
          .db()
          .collection("blacklists")
          .findOne({ belongsTo: req.user });
        return res.status(200).json({
          message: "Connections fetched.",
          data: allConnections,
        });
      case "POST":
        if (otherUser === undefined) {
          return res
            .status(404)
            .json({ message: "Invalid request.", data: null });
        }
        connection.clientPromise = await (await connectToMongoDb).connect();
        const addedToBlacklist = await connection.clientPromise
          .db()
          .collection("blacklists")
          .updateOne(
            { belongsTo: req.user },
            { $addToSet: { blacklist: otherUser } },
            { upsert: true }
          );
        await connection.clientPromise
          .db()
          .collection("connections")
          .deleteOne({
            $and: [
              { connectionBetween: { $elemMatch: { username: req.user } } },
              { connectionBetween: { $elemMatch: { username: otherUser } } },
            ],
          });
        return res.status(200).json({
          message: `${otherUser} added to blacklist.`,
          data: addedToBlacklist,
        });
      case "DELETE":
        if (otherUser === undefined) {
          return res
            .status(404)
            .json({ message: "Invalid request.", data: null });
        }
        connection.clientPromise = await (await connectToMongoDb).connect();
        const removedFromBlacklist = await connection.clientPromise
          .db()
          .collection("blacklists")
          .updateOne(
            { belongsTo: req.user },
            { $pull: { blacklist: otherUser } }
          );
        return res.status(200).json({
          message: "User removed from blacklist.",
          data: removedFromBlacklist,
        });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
