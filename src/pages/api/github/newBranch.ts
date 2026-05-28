import { upstreamRepo } from "@/config/default";
import { constructGithubBranchApiUrl, resolveGHApiUrl } from "@/utils/github";
import { Octokit } from "@octokit/core";
import { NextApiRequest, NextApiResponse } from "next";
import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

type NewBranchArgs = {
  octokit: InstanceType<typeof Octokit>;
  ghSourcePath: string;
  owner: string;
  env_owner: string;
};

export async function createNewBranch({
  octokit,
  ghSourcePath,
  owner,
  env_owner,
}: NewBranchArgs) {
  const { srcBranch, srcRepo, srcDirPath, filePath } =
    resolveGHApiUrl(ghSourcePath);

  let baseRefSha = "";
  // Get baseBranch sha
  try {
    const baseBranch = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner: env_owner,
        repo: srcRepo,
        ref: `heads/${srcBranch}`,
      }
    );
    baseRefSha = baseBranch.data.object.sha;
  } catch (err: any) {
    throw new Error(err?.message ?? "Cannot find base branch");
  }

  // Ensure the fork has the baseBranch (syncs from upstream, creates if missing)
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "development") {
    await octokit
      .request("POST /repos/{owner}/{repo}/merge-upstream", {
        owner,
        repo: upstreamRepo,
        branch: baseBranch,
      })
      .catch(() => {
        // Ignore errors — branch may already be up-to-date
      });
  }

  // Create new branch
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const baseDirName = srcDirPath.replaceAll("/", "--");
  const newBranchName = `${timeInSeconds}-${baseDirName}`;

  const newBranch = await octokit
    .request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo: upstreamRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    })
    .then(async () => {
      // construct branchUrl, used to populate branchUrl column
      const newBranchUrl = constructGithubBranchApiUrl({
        owner,
        filePath,
        newBranchName,
      });
      return newBranchUrl;
    })
    .catch((_err) => {
      throw new Error(
        _err.message ? _err.message : "Error creating new branch"
      );
    });
  return newBranch;
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

  const { ghSourcePath, owner, env_owner } = req.body;

  const result = await createNewBranch({
    octokit,
    upstreamRepo,
    baseBranch,
    branchName,
    owner,
  });

  try {
    // Call the createNewBranch function
    const branchUrl = await createNewBranch({
      octokit,
      ghSourcePath,
      owner,
      env_owner,
    });

    res.status(200).json({
      message: "succesfully created a new branch",
      branchUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message ?? "Error occurred while creating new branch",
    });
  }
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating new branch"
);
