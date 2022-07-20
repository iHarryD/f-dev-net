import { NextApiRequest } from "next";

export type RequestWithUser = NextApiRequest & {
  user: string;
};
