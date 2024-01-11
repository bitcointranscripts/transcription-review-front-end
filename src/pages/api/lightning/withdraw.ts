import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function LighteningWithdraw(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const amount = +req.body.amount ?? 0;
  const callbackUrl = req.body.callbackUrl ?? "";
  try {
    const lightningResponse: AxiosResponse<any, any> = await axios.get(
      `${callbackUrl}?amount=${amount * 1000}`
    );
    res.status(200).json(lightningResponse.data);
  } catch (error) {
    res.status(500).json({ message: `could not withdraw sats` });
  }
}
