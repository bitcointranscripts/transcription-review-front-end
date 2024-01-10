import { NextApiRequest, NextApiResponse } from "next";

export default async function LighteningWithdraw(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  res.send("test");
}
