import { DirectoryRes } from "@/types/api/dir";
import { Octokit } from "@octokit/core";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

async function getAllRepoFolder(octokit: InstanceType<typeof Octokit>) {
  const auth = await octokit.request("GET /user");
  // Fork the repository
  const contentsRepo = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/?ref=master",
    {
      owner: auth.data.login, // username of the owner
      repo: "bitcointranscripts",
    }
  );
  return contentsRepo.data.filter(
    (content: DirectoryRes) => content.type === "dir"
  );
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
  try {
    // getAllRepo Folders in the repo
    const allRepoFolders: DirectoryRes[] = await getAllRepoFolder(octokit);
    // Return the result
    res.status(200).json(allRepoFolders);
  } catch (error: any) {
    res.status(500).json({
      message:
        error?.message ?? "Error occurred while creating the fork and PR",
    });
  }
}
