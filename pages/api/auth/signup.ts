import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import * as bcrypt from "bcrypt";

import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import { userValidation } from "../../../joi/userValidation";

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
        const { error } = userValidation(req.body);
        if (error)
          return res
            .status(400)
            .json({ message: error.details[0].message, data: error });
        const mongodbConnection = await (await connectToMongoDb).connect();
        const user = await mongodbConnection
          .db()
          .collection("users")
          .findOne({
            $or: [{ username }, { email }],
          });
        if (user) {
          const userDoc = await cursorToDoc(user);
          let errorMessage: string = "";
          if (userDoc.username === username) {
            errorMessage = "This username is not available.";
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
            password: encryptedPassword,
            timestamp: new Date(),
          });
        return res
          .status(200)
          .json({ message: "Successfully registered.", data: newUser });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong.", data: err });
  }
}
