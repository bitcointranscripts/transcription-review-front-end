import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";
import { Metadata } from "@/utils";
import { createFork } from "./fork";
import { auth } from "../auth/[...nextauth]";

import endpoints from "@/services/api/endpoints";
import { Session } from "next-auth";
import axios from "axios";

type SaveEditProps = {
  octokit: InstanceType<typeof Octokit>;
  transcriptData: {
    metaData: Metadata;
    body: string;
  };
  ghSourcePath: string;
  ghBranchUrl?: string;
  directoryPath: string;
  reviewId: number;
  session: Session;
};

const upstreamRepo = "bitcointranscripts";

async function saveEdits({
  octokit,
  transcriptData,
  ghSourcePath,
  ghBranchUrl,
  directoryPath,
  reviewId,
  session,
}: SaveEditProps) {
  const forkResult = await createFork(octokit).catch((err) => {
    throw new Error("Repo fork failed");
  });
  const owner = forkResult.data.owner.login;
  const baseBranchName = forkResult.data.default_branch;

  const filepath = new URL(ghSourcePath).pathname.split("/").slice(4);
  const srcDirPath = filepath.slice(0, -1).join("/");
  // get filename and remove .md extension
  const fileName = filepath.slice(-1).toString();
  const fileNameWithoutExtension = fileName.slice(0, -3);
  const directoryName = directoryPath ? directoryPath : srcDirPath;
  const transcriptToSave = `${transcriptData.metaData.toString()}\n${
    transcriptData.body
  }\n`;

  console.log({ ghSourcePath, fileName, filepath, srcDirPath, directoryPath });

  const getBranchNameFromUrl = (url?: string) => {
    if (!url) return "";
    const branchName = new URL(url).pathname.split("/")[4];
    return branchName;
  };

  let ghBranchName = getBranchNameFromUrl(ghBranchUrl);

  if (!ghBranchUrl) {
    const baseBranch = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner,
        repo: upstreamRepo,
        ref: `heads/${baseBranchName}`,
      }
    );

    // Create new branch
    const timeInSeconds = Math.floor(Date.now() / 1000);
    const baseDirName = directoryName.replaceAll("/", "--");
    const newBranchName = `${timeInSeconds}-${baseDirName}`;
    const baseRefSha = baseBranch.data.object.sha;

    await octokit
      .request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        repo: upstreamRepo,
        ref: `refs/heads/${newBranchName}`,
        sha: baseRefSha,
      })
      .then(async () => {
        ghBranchName = newBranchName;

        // update branchUrl column in review table db
        const newBranchUrl = `https://github.com/${owner}/bitcointranscripts/tree/${ghBranchName}/${fileName}`;
        const updateReviewEndpoint = `${
          process.env.NEXT_PUBLIC_APP_QUEUE_BASE_URL
        }/${endpoints.REVIEW_BY_ID(reviewId)}`;
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
            console.error({ err });
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

  let fileToUpdateSha = "";
  await octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: upstreamRepo,
      path: filepath.join("/"),
      ref: ghBranchName,
    })
    .then((res) => {
      const data = res.data as { sha: string };
      fileToUpdateSha = data.sha;
    })
    .catch((err) => {
      throw new Error(
        `Cannot find ${fileName} sha ${err?.message && `\n ${err.message}`}`
      );
    });

  const fileContent = Buffer.from(transcriptToSave).toString("base64");
  await octokit
    .request("PUT /repos/:owner/:repo/contents/:path", {
      owner,
      repo: upstreamRepo,
      path: `${directoryName}/${fileName}`,
      message: `Updated "${transcriptData.metaData.fileTitle}" transcript submitted by ${owner}`,
      content: fileContent,
      branch: ghBranchName,
      sha: fileToUpdateSha,
    })
    .then()
    .catch((_err) => {
      console.log({ _err });
      throw new Error("Error creating new file");
    });
}

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

  // Read transcript details and ghSourcePath
  const {
    fileName,
    url,
    date,
    tags,
    speakers,
    categories,
    transcribedText,
    transcript_by,
    // prRepo,
    // prUrl,
    ghSourcePath,
    ghBranchUrl,
    directoryPath,
    reviewId,
  } = req.body;

  const newMetadata = new Metadata({
    fileTitle: fileName,
    transcript_by: transcript_by,
    url,
    date,
    tags,
    speakers,
    categories,
  });

  const transcriptData = {
    metaData: newMetadata,
    body: transcribedText,
  };

  try {
    await saveEdits({
      octokit,
      transcriptData,
      ghSourcePath,
      ghBranchUrl,
      directoryPath,
      reviewId,
      session,
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
