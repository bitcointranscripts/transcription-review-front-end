import { upstreamRepo } from "@/config/default";
import endpoints from "@/services/api/endpoints";
import { resolveRawGHUrl } from "@/utils/github";
import { Octokit } from "@octokit/core";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { auth } from "../auth/[...nextauth]";

type NewBranchArgs = {
  octokit: InstanceType<typeof Octokit>;
  reviewId: string;
  baseBranchName: string;
  ghSourcePath: string;
  owner: string;
  session: Session;
};

export async function createNewBranch({
  octokit,
  reviewId,
  baseBranchName,
  ghSourcePath,
  owner,
  session,
}: NewBranchArgs) {
  const { srcDirPath, filePath } = resolveRawGHUrl(ghSourcePath);
  let baseRefSha = "";
  // Get baseBranch sha
  console.log({owner, upstreamRepo, baseBranchName})
  try {
    const baseBranch = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner,
        repo: upstreamRepo,
        ref: `heads/${baseBranchName}`,
      }
    );
    baseRefSha = baseBranch.data.object.sha;
  } catch (err: any) {
    throw new Error(err?.message ?? "Cannot find base branch");
  }

  // Create new branch
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
    .then(async () => {
      console.log("created new branch");
      // update branchUrl column in review table db
      const newBranchUrl = `https://github.com/${owner}/bitcointranscripts/tree/${newBranchName}/${filePath}`;
      const updateReviewEndpoint = `${
        process.env.NEXT_PUBLIC_APP_QUEUE_BASE_URL
      }/${endpoints.REVIEW_BY_ID(Number(reviewId))}`;
      await axios
        .put(
          updateReviewEndpoint,
          {
            branchUrl: newBranchUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${session!.user!.jwt}`,
            },
          }
        )
        .then((res) => {
          console.log("status: ", res.status, "data: ", res.data);
          if (res.status < 200 || res.status > 299) {
            throw new Error("Unable to save branchUrl to db");
          }
        })
        .catch((err) => {
          console.error("failed to update db", { err });
          const errMessage =
            err?.response?.data?.message ??
            err?.message ??
            "Error saving branchUrl to db";
          throw new Error(errMessage);
        });
    })
    .catch((_err) => {
      throw new Error(
        _err.message ? _err.message : "Error creating new branch"
      );
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

  const { reviewId, baseBranchName, ghSourcePath, owner } = req.body;

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Call the createNewBranch function
    await createNewBranch({
      octokit,
      reviewId,
      baseBranchName,
      ghSourcePath,
      owner,
      session,
    });

    res
      .status(200)
      .json({ message: "succesfully created a new branch and saved to db" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while creating fork" });
  }
}
