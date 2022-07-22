import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import * as bcrypt from "bcrypt";

import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";

const cors = Cors({
  methods: ["POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const {
    method,
    body: { username, password, email, name },
  } = req;
  try {
    switch (method) {
      case "POST":
        if (!username || !password || !email || !name) {
          return res
            .status(401)
            .json({ message: "Incomplete data received.", data: null });
        }
        const mongodbConnection = await (await connectToMongoDb).connect();
        const user = await mongodbConnection.db().collection("users").findOne({
          username,
        });
        if (user) {
          let errorMessage: string = "";
          if (user.username === username) {
            errorMessage = "Username taken.";
          } else {
            errorMessage = "This email is already registered with us.";
          }
          return res.status(403).json({ message: errorMessage, data: null });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await mongodbConnection
          .db()
          .collection("users")
          .insertOne({
            ...req.body,
            bio: "",
            image: "",
            savedPosts: [],
            password: encryptedPassword,
            timestamp: new Date(),
          });
        return res
          .status(200)
          .json({ message: "Successfully registered.", data: newUser });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "Something went wrong.", data: null });
  }
}
