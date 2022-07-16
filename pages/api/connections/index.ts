import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import connectToMongoDb from "../../../lib/mongodb";
import { nextAuthConfig } from "../auth/[...nextauth]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const session = await unstable_getServerSession(req, res, nextAuthConfig);
  if (session === null) return res.status(401).json({ message: "Private" });
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const allConnections = await connection.clientPromise
          .db()
          .collection("connections")
          .find({
            connectionBetween: { $in: [session.user.username] },
          });
        return res
          .status(200)
          .json({ message: "Connections fetched", data: allConnections });
      case "POST":
        connection.clientPromise = await (await connectToMongoDb).connect();
        await connection.clientPromise
          .db()
          .collection("connections")
          .insertOne({
            connectionBetween: [session.user.username, req.body.otherUser],
            isActive: false,
            initiatedBy: session.user.username,
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
