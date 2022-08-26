import { Document, Filter, MongoClient, ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import corsMiddleware from "../../../helpers/corsMiddleware";
import { postValidation } from "../../../joi/postValidation";
import connectToMongoDb from "../../../lib/mongodb";
import Cors from "cors";
import { uploadImage } from "../../../cloudinary";
import { cursorToDoc } from "../../../helpers/cursorToDoc";
import { RequestWithUser } from "../../../interfaces/Common.type";
import verifyToken from "../../../helpers/verifyToken";

const cors = Cors({
  methods: ["GET", "POST"],
  credentials: true,
  origin: ["http://localhost:3000", "https://roc8-dev-net.vercel.app"],
});

export default async function (req: RequestWithUser, res: NextApiResponse) {
  await corsMiddleware(req, res, cors);

  const { method } = req;
  const connection: { clientPromise: null | MongoClient } = {
    clientPromise: null,
  };
  try {
    switch (method) {
      case "GET":
        connection.clientPromise = await (await connectToMongoDb).connect();
        const filter: Filter<Document> = {};
        if (req.query.filter === "query") {
          filter.category = "query";
        } else if (req.query.filter === "general") {
          filter.category = "general";
        }
        if (req.query.user) {
          if (req.query.relation === "liked") {
            filter.likes = {
              $in: Array.isArray(req.query.user)
                ? req.query.user
                : [req.query.user],
            };
          } else if (req.query.relation === "commented") {
            filter.comments = { $elemMatch: { postedBy: req.query.user } };
          } else {
            filter["postedBy.username"] = req.query.user;
          }
        }
        const result = connection.clientPromise
          .db()
          .collection("posts")
          .find(filter)
          .sort(
            req.query.sort === "trending" ? { likes: -1 } : { timestamp: -1 }
          );
        let paginatedResults = await cursorToDoc(result);
        const paginationData: {
          count?: number;
          currentPage?: number;
          nextPage?: number | null;
          previousPage?: number | null;
        } = {};
        if (req.query.page) {
          const requestedPageNumber = Number(req.query.page as string);
          const resultsPerPage = 5;
          const startIndex = (requestedPageNumber - 1) * resultsPerPage;
          const endIndex = requestedPageNumber * resultsPerPage;
          const nextPage =
            paginatedResults.length > endIndex ? requestedPageNumber + 1 : null;
          const previousPage =
            requestedPageNumber - 1 > 0 ? requestedPageNumber - 1 : null;
          paginatedResults = paginatedResults.slice(startIndex, endIndex);
          paginationData.count = paginatedResults.length;
          paginationData.currentPage = requestedPageNumber;
          paginationData.nextPage = nextPage;
          paginationData.previousPage = previousPage;
        }
        return res.status(200).json({
          message: "Posts fetched.",
          data: {
            posts: paginatedResults,
            paginationData: req.query.page ? paginationData : null,
          },
        });
      case "POST":
        await verifyToken(req, res);
        const { error } = postValidation(req.body);
        if (error)
          return res
            .status(500)
            .json({ message: error.details[0].message, data: error });
        connection.clientPromise = await (await connectToMongoDb).connect();
        if (req.body.media) {
          const publicID = await uploadImage(req.body.media);
          req.body.media = publicID.secure_url;
        } else {
          req.body.media = null;
        }
        const user = await connection.clientPromise
          .db()
          .collection("users")
          .findOne({ username: req.user });
        if (user === null) {
          return res
            .status(404)
            .json({ message: "User not found.", data: null });
        }
        const insertedDoc = await connection.clientPromise
          .db()
          .collection("posts")
          .insertOne({
            ...req.body,
            likes: [],
            comments: [],
            commentsActive: true,
            timestamp: new Date(),
            lastModified: new Date(),
            postedBy: {
              username: user.username,
              name: user.name,
              image: user.image,
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
