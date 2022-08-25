import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDb from "../../../../lib/mongodb";
import Cors from "cors";
import corsMiddleware from "../../../../helpers/corsMiddleware";
import { cursorToDoc } from "../../../../helpers/cursorToDoc";
import { User } from "../../../../interfaces/Common.interface";

const cors = Cors({
  methods: ["GET"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const users = connection.clientPromise
          .db()
          .collection("users")
          .find(
            { username: { $regex: req.query.username, $options: "gi" } },
            { projection: { email: 0, password: 0, timestamp: 0 } }
          );
        return res.status(200).json({
          message: "Users fetched.",
          data: (await cursorToDoc(users)).map((user: User) => ({
            image: user.image,
            name: user.name,
            username: user.username,
          })),
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
