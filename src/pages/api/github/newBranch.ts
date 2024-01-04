import { upstreamRepo } from "@/config/default";
import endpoints from "@/services/api/endpoints";
import { constructGithubBranchUrl, resolveRawGHUrl } from "@/utils/github";
import { Octokit } from "@octokit/core";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { auth } from "../auth/[...nextauth]";

type NewBranchArgs = {
  octokit: InstanceType<typeof Octokit>;
  reviewId: number;
  ghSourcePath: string;
  owner: string;
  session: Session;
};

export async function createNewBranch({
  octokit,
  reviewId,
  ghSourcePath,
  owner,
  session,
}: NewBranchArgs) {
  const { srcBranch, srcRepo, srcDirPath, filePath } =
    resolveRawGHUrl(ghSourcePath);

  let baseRefSha = "";
  // Get baseBranch sha
  try {
    const baseBranch = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner,
        repo: srcRepo,
        ref: `heads/${srcBranch}`,
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

  const newBranch = await octokit
    .request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo: upstreamRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    })
    .then(async () => {
      // update branchUrl column in review table db
      const newBranchUrl = constructGithubBranchUrl({
        owner,
        filePath,
        newBranchName,
      });

      const updateReviewEndpoint = `${
        process.env.NEXT_PUBLIC_APP_QUEUE_BASE_URL
      }/${endpoints.REVIEW_BY_ID(reviewId)}`;

      const updatedReviewBranchUrl = await axios
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
          if (res.status < 200 || res.status > 299) {
            throw new Error("Unable to save branchUrl to db");
          }
          return newBranchUrl;
        })
        .catch((err) => {
          console.error("failed to update db", { err });
          const errMessage =
            err?.response?.data?.message ??
            err?.message ??
            "Error saving branchUrl to db";
          throw new Error(errMessage);
        });
      return updatedReviewBranchUrl;
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

  const { reviewId, ghSourcePath, owner } = req.body;

  // Initialize Octokit with the user's access token
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Call the createNewBranch function
    const parsedReviewId = parseInt(reviewId);
    await createNewBranch({
      octokit,
      reviewId: parsedReviewId,
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
