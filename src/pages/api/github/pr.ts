import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";

import { createPullRequest } from "@/utils/github";
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

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  const { owner, repo, title, body, head, base } = req.body;

  try {
    const prResult = await createPullRequest({
      octokit,
      owner,
      repo,
      title,
      body,
      head,
      base,
    });

    return res.status(200).json(prResult.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message:
        error?.message ?? "Error occurred while creating the Pull Request",
    });
  }
}
