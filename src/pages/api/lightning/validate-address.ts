import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function ValidateLightningAddress(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lnAddress = req.body.lnAddress as string;
  const addrWithDomain = lnAddress.split("@");
  const lightningRequestUrl = `https://${addrWithDomain[1]}/.well-known/lnurlp/${addrWithDomain[0]}`;
  try {
    const lightningResponse = await axios.get(lightningRequestUrl);
    res.status(200).json(lightningResponse.data);
  } catch (error) {
    res.status(404).json({ message: `${addrWithDomain[1]} wallet not found` });
  }
}
