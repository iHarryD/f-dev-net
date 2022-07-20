import { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDb from "../../../lib/mongodb";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Cors from "cors";
import corsMiddleware from "../../../helpers/corsMiddleware";

const invalidCredentialsMessage = "Invalid credentials.";

const cors = Cors({
  methods: ["POST"],
  credentials: true,
  origin: "http://localhost:3000",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);
  const {
    method,
    body: { username, password },
  } = req;
  try {
    switch (method) {
      case "POST":
        if (!username || !password) {
          return res
            .status(401)
            .json({ message: invalidCredentialsMessage, data: null });
        }
        const mongodbConnection = await (await connectToMongoDb).connect();
        const user = await mongodbConnection.db().collection("users").findOne({
          username,
        });
        if (user === null)
          return res
            .status(404)
            .json({ message: invalidCredentialsMessage, data: null });
        const doPasswordsMatch = await bcrypt.compare(password, user.password);
        if (doPasswordsMatch) {
          const badges = mongodbConnection
            .db()
            .collection("badges")
            .find({ givenTo: user.username });
          const connections = mongodbConnection
            .db()
            .collection("connections")
            .find({
              $and: [
                { connectionBetween: { $in: [user.username] } },
                { isActive: true },
              ],
            });
          const posts = mongodbConnection
            .db()
            .collection("posts")
            .find({ "postedBy.username": user.username });
          const token = jwt.sign(
            { user: user.username },
            process.env.JWT_SECRET as string
          );
          return res.status(200).json({
            message: "Login successful.",
            data: {
              user: {
                ...user,
                badges,
                connections,
                posts,
              },
              token,
            },
          });
        }
    }
    return res
      .status(403)
      .json({ message: invalidCredentialsMessage, data: null });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong.", data: err });
  }
}
