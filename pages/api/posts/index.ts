import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import corsMiddleware from "../../../helpers/corsMiddleware";
import { postValidation } from "../../../joi/postValidation";
import connectToMongoDb from "../../../lib/mongodb";
import { nextAuthConfig } from "../auth/[...nextauth]";
import Cors from "cors";
import { uploadImage } from "../../../cloudinary";

const cors = Cors({
  methods: ["POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "POST":
        const validation = postValidation(req.body);
        if (validation.error)
          return res
            .status(500)
            .json({ message: validation.error.details[0].message });
        const session = await unstable_getServerSession(
          req,
          res,
          nextAuthConfig
        );
        if (session === null)
          return res.status(300).json({ message: "Unauthorized" });
        connection.clientPromise = await (await connectToMongoDb).connect();
        if (req.body.media) {
          const publicID = await uploadImage(req.body.media);
          req.body.media = publicID.secure_url;
        }
        const insertedDoc = await connection.clientPromise
          .db()
          .collection("posts")
          .insertOne({
            ...req.body,
            likes: [],
            comments: [],
            timestamp: new Date(),
            postedBy: {
              name: session.user.name,
              username: session.user.username,
              image: session.user.image,
            },
          });
        const newPost = await connection.clientPromise
          .db()
          .collection("posts")
          .findOne({ _id: insertedDoc.insertedId });
        return res.status(200).json({ message: "Posted", data: newPost });
      default:
        return res.status(404).json({
          message: "Requested method is not allowed at this endpoint.",
        });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error encountered", data: err });
  }
}
