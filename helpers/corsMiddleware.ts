import { NextApiRequest, NextApiResponse } from "next";

export default function corsMiddleware(
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
