import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../../lib/mongodb";
import { nextAuthConfig } from "../../auth/[...nextauth]";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";

const cors = Cors({
  methods: ["GET", "POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const { connectionID } = req.query;
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return res.status(401).json({ message: "Private" });
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "PATCH":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const establishedConnection = await connection.clientPromise
          .db()
          .collection("connections")
          .updateOne(
            {
              _id: new ObjectId(connectionID as string),
              connectionBetween: {
                $all: [session.user.username, req.body.otherUser],
              },
              initiatedBy: req.body.otherUser,
            },
            {
              $set: { isActive: true },
            }
          );
        return res.status(200).json({
          message: "Connection established.",
          data: establishedConnection,
        });
      case "DELETE":
        connection.clientPromise = await (await connectToMongoDb).connect();
        await connection.clientPromise
          .db()
          .collection("connections")
          .findOneAndDelete({
            _id: new ObjectId(connectionID as string),
            connectionBetween: {
              $all: [session.user.username, req.body.otherUser],
            },
          });
        return res
          .status(200)
          .json({ message: "Connection deleted.", data: null });
      default:
        return res.status(405).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error", data: err });
  }
}
