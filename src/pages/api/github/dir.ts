import { DirectoryRes } from "@/types/api/dir";
import { Octokit } from "@octokit/core";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

async function getAllRepoFolder(
  octokit: InstanceType<typeof Octokit>,
  path?: string
) {
  const auth = await octokit.request("GET /user");
  // Fork the repository
  const contentsRepo = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}/?ref=master",
    {
      owner: auth.data.login, // username of the owner
      repo: "bitcointranscripts",
      path: path || "",
    }
  );
  return contentsRepo.data
    .filter(
      ({ type, path }: DirectoryRes) => type === "dir" && path.match(/^[^\.]/) // removes hidden files / folder
    )
    .map((content: DirectoryRes) => ({
      slug: content.name,
      value: content.path,
    }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user is authenticated
  const session = await getSession({ req });
  if (!session || !session.accessToken || !session.user?.githubUsername) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });
  const path = req.query?.path as string;
  try {
    // getAllRepo Folders in the repo
    const allRepoFolders: DirectoryRes[] = await getAllRepoFolder(
      octokit,
      path
    );
    // Return the result
    res.status(200).json({ dir: allRepoFolders });
  } catch (error: any) {
    res.status(error.status).json({
      message: error?.message,
    });
  }
}
