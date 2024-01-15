import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function LightningWithdraw(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const amount = req.body.amount;
  const callbackUrl = req.body.callbackUrl ?? "";
  try {
    if (amount === 0) {
      throw Error("amount to send cannot be zero");
    }
    const lightningResponse: AxiosResponse<any, any> = await axios.get(
      `${callbackUrl}?amount=${amount * 1000}`
    );
    res.status(200).json(lightningResponse.data);
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || `unable to make payment, try again later`,
    });
  }
}
