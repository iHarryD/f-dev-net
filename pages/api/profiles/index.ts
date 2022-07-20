import { NextApiResponse } from "next";
import connectToMongoDB from "../../../lib/mongodb";
import { MongoClient } from "mongodb";
import connectToMongoDb from "../../../lib/mongodb";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import { uploadImage } from "../../../cloudinary";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import verifyToken from "../../../helpers/verifyToken";
import { RequestWithUser } from "../../../interfaces/Common.type";

const cors = Cors({
  methods: ["GET", "PATCH"],
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
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const userDoc = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: req.user });
        if (userDoc === null) throw new Error("User not found.");
        const badges = connection.clientPromise
          .db()
          .collection("badges")
          .find({ givenTo: req.user });
        const connections = connection.clientPromise
          .db()
          .collection("connections")
          .find({ connectionBetween: { $in: [req.user] } });
        const posts = connection.clientPromise
          .db()
          .collection("posts")
          .find({ "postedBy.username": req.user });
        const userDetails = {
          badges: await cursorToDoc(badges),
          connections: await cursorToDoc(connections),
          posts: await cursorToDoc(posts),
          ...(await cursorToDoc(userDoc)),
        };
        return res
          .status(200)
          .json({ message: "User fetched.", data: userDetails });
      case "PATCH":
        const { name, bio, image } = req.body;
        connection.clientPromise = await (await connectToMongoDB).connect();
        const updates: { name: string; bio: string; image?: string } = {
          name,
          bio,
        };
        if (image) {
          const publicID = await uploadImage(image);
          updates.image = publicID.secure_url;
        }
        const updatedUser = await connection.clientPromise
          .db()
          .collection("users")
          .updateOne(
            { username: req.user },
            {
              $set: updates,
            }
          );
        return res.json({ message: "Profile updated.", data: updatedUser });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
}
