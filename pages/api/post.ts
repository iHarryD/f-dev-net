import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { postValidation } from "../../joi/postValidation";
import connectToMongoDb from "../../lib/mongodb";
import { nextAuthConfig } from "./auth/[...nextauth]";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "DELETE"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  func: (req: NextApiRequest, res: NextApiResponse, callback: any) => any
) {
  return new Promise((resolve, reject) => {
    func(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  const { method } = req;
  switch (method) {
    case "POST":
      const validation = postValidation(req.body);
      if (validation.error)
        return res
          .status(500)
          .json({ message: validation.error.details[0].message });
      try {
        const session = await unstable_getServerSession(
          req,
          res,
          nextAuthConfig
        );
        // if (session === null)
        //   return res.status(300).json({ message: "Unauthorized" });
        connection.clientPromise = await (await connectToMongoDb).connect();
        const newPost = await connection.clientPromise
          .db()
          .collection("posts")
          .insertOne({
            ...req.body,
            likes: [],
            comments: [],
            timestamp: new Date(),
            postedBy: {
              name: "Harry",
              username: "iharryd",
            },
          });
        return res.status(200).json({ message: "Posted", data: newPost });
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Error encountered", data: err });
      } finally {
        if (connection.clientPromise) {
          connection.clientPromise.close();
        }
      }
    default:
      return res
        .status(404)
        .json({ message: "Requested method is not allowed at this endpoint." });
  }
}
