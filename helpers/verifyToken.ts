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
  jwt.verify(token, process.env.JWT as string, (err, data) => {
    if (err || data === undefined)
      return res.status(401).json({ message: "Invalid token!", data: null });
    req.user = data.user;
  });
}
