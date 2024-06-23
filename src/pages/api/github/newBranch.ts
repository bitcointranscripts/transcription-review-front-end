import { upstreamOwner } from "@/config/default";
import { Octokit } from "@octokit/core";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../auth/[...nextauth]";

type NewBranchArgs = {
  octokit: InstanceType<typeof Octokit>;
  upstreamRepo: string;
  baseBranch: string;
  branchName: string;
  owner: string;
};

export async function createNewBranch({
  octokit,
  upstreamRepo,
  baseBranch,
  branchName,
  owner,
}: NewBranchArgs) {
  // When in development mode, we use the current user's repository as the
  // base repository for all github operations
  const repositoryOwner =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? owner
      : upstreamOwner;

  // Get baseBranch sha
  const baseRefSha = await octokit
    .request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
      owner: repositoryOwner,
      repo: upstreamRepo,
      ref: `heads/${baseBranch}`,
    })
    .then((result) => result.data.object.sha)
    .catch((err: any) => {
      throw new Error(err?.message ?? "Cannot find base branch");
    });

  // Create new branch
  return await octokit
    .request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo: upstreamRepo,
      ref: `refs/heads/${branchName}`,
      sha: baseRefSha,
    })
    .catch((err) => {
      throw new Error(err?.message ?? "Error creating new branch");
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user is authenticated
  const session = await auth(req, res);
  if (!session || !session.accessToken || !session.user?.githubUsername) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { upstreamRepo, baseBranch, branchName } = req.body;

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Call the createNewBranch function
    const result = await createNewBranch({
      octokit,
      upstreamRepo,
      baseBranch,
      branchName,
      owner: session.user.githubUsername,
    });

    res.status(200).json({
      message: "succesfully created a new branch",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message ?? "Error occurred while creating new branch",
    });
  }
}
