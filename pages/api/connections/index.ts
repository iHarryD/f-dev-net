import { MongoClient } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import { RequestWithUser } from "../../../interfaces/Common.type";
import verifyToken from "../../../helpers/verifyToken";
import {
  ConnectionInDatabase,
  User,
} from "../../../interfaces/Common.interface";

const cors = Cors({
  methods: ["GET", "POST"],
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
    connection.clientPromise = await (await connectToMongoDb).connect();
    switch (method) {
      case "GET":
        const allConnections = connection.clientPromise
          .db()
          .collection("connections")
          .find({
            connectionBetween: { $elemMatch: { username: req.user } },
          });
        const simplifiedConnections = (await cursorToDoc(allConnections)).map(
          (connection: ConnectionInDatabase) => ({
            connectionWith: connection.connectionBetween.find(
              (user) => user.username !== req.user
            ),
            initiatedBy: connection.initiatedBy,
            isActive: connection.isActive,
          })
        );
        return res.status(200).json({
          message: "Connections fetched",
          data: simplifiedConnections,
        });
      case "POST":
        if (
          req.body.otherUser === undefined ||
          req.user === req.body.otherUser
        ) {
          return res.status(500).json({
            message: "Could not add the user to blacklist.",
            data: null,
          });
        }
        const isInBlacklist = await connection.clientPromise
          .db()
          .collection("blacklists")
          .findOne({
            belongsTo: { $in: [req.user, req.body.otherUser] },
            blacklist: { $in: [req.user, req.body.otherUser] },
          });
        if (isInBlacklist) {
          return res.status(500).json({
            message: "Connection couldn't be initiated.",
            data: null,
          });
        }
        const bothUser: [User, User] = await cursorToDoc(
          connection.clientPromise
            .db()
            .collection("users")
            .find(
              { username: { $in: [req.user, req.body.otherUser] } },
              {
                projection: {
                  email: 0,
                  password: 0,
                  timestamp: 0,
                  _id: 0,
                },
              }
            )
        );
        if (bothUser.length !== 2) {
          return res
            .status(500)
            .json({ message: "Something went wrong.", data: null });
        }
        await connection.clientPromise
          .db()
          .collection("connections")
          .insertOne({
            connectionBetween: [
              bothUser.find((user) => user.username === req.user),
              bothUser.find((user) => user.username === req.body.otherUser),
            ],
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
