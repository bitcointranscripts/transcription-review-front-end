import type { NextApiRequest, NextApiResponse } from "next";
import { createPullRequest } from "@/utils/github";
import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { octokit, owner } = await getOctokit(req, res);
  const { repo, title, body, head, base } = req.body;

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
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating the Pull Request"
);
