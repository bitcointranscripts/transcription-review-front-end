import type { NextApiRequest, NextApiResponse } from "next";

import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { octokit, owner } = await getOctokit(req, res);
  const { repo } = req.body;

  // Fork the repository
  const result = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner,
    repo,
  });
  res.status(200).json(result.data);
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating fork"
);
