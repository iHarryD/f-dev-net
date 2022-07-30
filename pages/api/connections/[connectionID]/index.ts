import { MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import verifyToken from "../../../../helpers/verifyToken";
import { RequestWithUser } from "../../../../interfaces/Common.type";

const cors = Cors({
  methods: ["GET", "POST"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  await verifyToken(req, res);
  const { method } = req;
  const { connectionID } = req.query;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    connection.clientPromise = await (await connectToMongoDb).connect();
    const otherUser = await connection.clientPromise
      .db()
      .collection("users")
      .findOne({
        username: req.body.otherUser,
      });
    if (otherUser === null)
      return res.status(303).json({ message: "User not found.", data: null });
    switch (method) {
      case "PATCH":
        const establishedConnection = await connection.clientPromise
          .db()
          .collection("connections")
          .updateOne(
            {
              _id: new ObjectId(connectionID as string),
              connectionBetween: {
                $all: [req.user, otherUser.username],
              },
              initiatedBy: otherUser.username,
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
              $all: [req.user, otherUser.username],
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
