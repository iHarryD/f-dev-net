import { NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { RequestWithUser } from "../interfaces/Common.type";

export default async function verifyToken(
  req: RequestWithUser,
  res: NextApiResponse
) {
  const token = req.headers.authorization;
  if (token === undefined)
    return res.status(403).json({ message: "Unauthorized.", data: null });
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
    user?: string;
  };
  if (decodedToken?.user) {
    req.user = decodedToken.user;
  } else {
    return res.status(401).json({ message: "Invalid token!", data: null });
  }
}
