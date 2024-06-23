import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";

import { getFileSha, updateOrCreateFile } from "@/utils/github";
import { auth } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: {
      // when saving dpe format we need
      // bigger limit than the default 1mb
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user is authenticated
  const session = await auth(req, res);
  if (
    !session ||
    !session.accessToken ||
    !session.user?.jwt ||
    !session.user?.githubUsername
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  const { repo, filePath, fileContent, branch } = req.body;

  try {
    const fileSha = await getFileSha({
      octokit,
      owner: session.user.githubUsername,
      repo,
      path: filePath,
      branch,
    });

    await updateOrCreateFile({
      octokit,
      owner: session.user.githubUsername,
      repo,
      path: filePath,
      fileContent,
      branch,
      sha: fileSha,
    });

    res.status(200).json({ message: "Successfully saved edits" });
  } catch (error: any) {
    console.error(error);
    const errMessage = error?.message;
    res
      .status(500)
      .json({ message: errMessage ?? "Error occurred while saving fork" });
  }
}
