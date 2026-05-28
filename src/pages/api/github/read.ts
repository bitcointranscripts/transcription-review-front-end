import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { auth } from "../auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Authenticate the session and retrieve the access token
  const session = await auth(req, res);
  if (!session || !session.accessToken || !session.user?.githubUsername) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { branchUrl } = req.body;
  if (typeof branchUrl !== "string") {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const response = await axios.get(branchUrl, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        // Use the GitHub access token for authenticated GitHub requests
        Authorization: `token ${session.accessToken}`,
      },
    });
    res.status(200).json({ content: response.data });
  } catch (error: any) {
    res
      .status(error.response.status)
      .json({ message: "Failed to fetch GitHub file content" });
  }
}

export default handler;
