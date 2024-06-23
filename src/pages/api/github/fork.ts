import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";

import { auth } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user is authenticated
  const session = await auth(req, res);
  if (!session || !session.accessToken || !session.user?.githubUsername) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { owner, repo } = req.body;

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Fork the repository
    const result = await octokit.request("POST /repos/{owner}/{repo}/forks", {
      owner,
      repo,
    });
    res.status(200).json(result.data);
  } catch (error) {
    console.error("fork failed");
    console.error(error);
    res.status(500).json({ message: "Error occurred while creating fork" });
  }
}
