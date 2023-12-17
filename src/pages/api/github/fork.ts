import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Octokit } from "@octokit/core";
import { upstreamOwner, upstreamRepo } from "@/config/default";

export async function createFork(octokit: InstanceType<typeof Octokit>) {
  // Fork the repository
  const forkResult = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner: upstreamOwner,
    repo: upstreamRepo,
  });

  return forkResult;
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
    // Call the createForkAndPR function
    const forkResult = await createFork(octokit);
    console.log("forked successfully")
    res.status(200).json(forkResult.data);
  } catch (error) {
    console.log("fork failed")
    console.error(error);
    res.status(500).json({ message: "Error occurred while creating fork" });
  }
}
