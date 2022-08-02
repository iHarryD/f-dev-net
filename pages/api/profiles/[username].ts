import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import connectToMongoDb from "../../../lib/mongodb";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";

const cors = Cors({
  methods: ["GET"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const { username } = req.query;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const userDoc = await connection.clientPromise
          .db()
          .collection("users")
          .findOne(
            { username },
            { projection: { _id: 0, email: 0, password: 0, timestamp: 0 } }
          );
        if (userDoc === null)
          return res
            .status(404)
            .json({ message: "User not found.", data: null });
        const badges = connection.clientPromise
          .db()
          .collection("badges")
          .find({ givenTo: username });
        const connections = connection.clientPromise
          .db()
          .collection("connections")
          .find(
            { connectionBetween: { $in: [username] }, isActive: true },
            { projection: { connectionBetween: 1 } }
          );
        const posts = connection.clientPromise
          .db()
          .collection("posts")
          .find({ "postedBy.username": username });
        const userDetails = {
          badges: await cursorToDoc(badges),
          connections: await cursorToDoc(connections),
          posts: await cursorToDoc(posts),
          ...(await cursorToDoc(userDoc)),
        };
        return res
          .status(200)
          .json({ message: "User fetched.", data: userDetails });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error.", data: err });
  }
}
