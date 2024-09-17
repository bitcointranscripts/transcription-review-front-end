import { upstreamOwner } from "@/config/default";
import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";
import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

type NewBranchArgs = {
  octokit: Octokit;
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { octokit, owner } = await getOctokit(req, res);
  const { upstreamRepo, baseBranch, branchName } = req.body;

  const result = await createNewBranch({
    octokit,
    upstreamRepo,
    baseBranch,
    branchName,
    owner,
  });

  res.status(200).json({
    message: "successfully created a new branch",
    ...result,
  });
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating new branch"
);
