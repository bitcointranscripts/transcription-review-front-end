import type { NextApiRequest, NextApiResponse } from "next";

import { getFileSha, updateOrCreateFile } from "@/utils/github";
import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

export const config = {
  api: {
    bodyParser: {
      // when saving dpe format we need
      // bigger limit than the default 1mb
      sizeLimit: "10mb",
    },
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { octokit, owner } = await getOctokit(req, res);

  const { repo, filePath, fileContent, branch } = req.body;

  const fileSha = await getFileSha({
    octokit,
    owner,
    repo,
    path: filePath,
    branch,
  });

  await updateOrCreateFile({
    octokit,
    owner,
    repo,
    path: filePath,
    fileContent,
    branch,
    sha: fileSha,
  });

  res.status(200).json({ message: "Successfully saved edits" });
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating the Pull Request"
);
