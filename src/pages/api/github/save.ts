import type { NextApiRequest, NextApiResponse } from "next";

import { upstreamRepo } from "@/config/default";
import { Metadata } from "@/utils";
import {
  getFileSha,
  resolveGHApiUrl,
  updateOrCreateFile,
} from "@/utils/github";
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

  const {
    fileName,
    url,
    date,
    tags,
    speakers,
    categories,
    transcribedText,
    transcript_by,
    ghSourcePath,
    ghBranchUrl,
    directoryPath,
    reviewId,
    ...otherMetadata
  } = req.body;

  const newMetadata = new Metadata({
    fileTitle: fileName,
    transcript_by,
    url,
    date,
    tags,
    speakers,
    categories,
    ...otherMetadata,
  });

  const { filePath } = resolveGHApiUrl(ghSourcePath);
  const { srcBranch: branch } = resolveGHApiUrl(ghBranchUrl);

  const fileContent = `${newMetadata.toString()}${transcribedText}`;

  const fileSha = await getFileSha({
    octokit,
    owner,
    repo: upstreamRepo,
    path: filePath,
    branch,
  });

  await updateOrCreateFile({
    octokit,
    owner,
    repo: upstreamRepo,
    path: filePath,
    fileContent,
    branch,
    sha: fileSha,
  });

  res.status(200).json({ message: "Successfully saved edits" });
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while saving edits"
);
