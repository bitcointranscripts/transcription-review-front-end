import { upstreamOwner, upstreamRepo } from "@/config/default";
import {
  constructGithubBranchApiUrl,
  resolveGHApiUrl,
  syncForkWithUpstream,
} from "@/utils/github";
import { getOctokit } from "@/utils/getOctokit";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";
import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";

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
  const repositoryOwner =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? owner
      : upstreamOwner;

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
  const { ghSourcePath, env_owner } = req.body;

  const { srcBranch, srcRepo, srcDirPath, filePath } =
    resolveGHApiUrl(ghSourcePath);

  await syncForkWithUpstream({
    octokit,
    upstreamOwner,
    upstreamRepo,
    forkOwner: owner,
    forkRepo: upstreamRepo,
  });

  // Resolve base branch SHA — try srcBranch first, fall back to master/main
  let baseRefSha = "";
  const branchesToTry = srcBranch
    ? [srcBranch, "master", "main"]
    : ["master", "main"];
  for (const branch of branchesToTry) {
    try {
      const ref = await octokit.request(
        "GET /repos/{owner}/{repo}/git/ref/{ref}",
        { owner: env_owner, repo: srcRepo, ref: `heads/${branch}` }
      );
      baseRefSha = ref.data.object.sha;
      break;
    } catch {
      // try next
    }
  }
  if (!baseRefSha) {
    throw new Error(`Cannot find source branch in ${env_owner}/${srcRepo}`);
  }

  const timeInSeconds = Math.floor(Date.now() / 1000);
  const baseDirName = srcDirPath.replaceAll("/", "--");
  const newBranchName = `${timeInSeconds}-${baseDirName}`;

  await octokit
    .request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo: upstreamRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    })
    .catch((_err) => {
      throw new Error(_err.message ?? "Error creating new branch");
    });

  const branchUrl = constructGithubBranchApiUrl({
    owner,
    filePath,
    newBranchName,
  });

  res.status(200).json({
    message: "successfully created a new branch",
    branchUrl,
  });
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while creating new branch"
);
