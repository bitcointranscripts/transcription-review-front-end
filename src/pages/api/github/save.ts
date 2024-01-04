import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";
import { Metadata } from "@/utils";
import { createFork } from "./fork";
import { auth } from "../auth/[...nextauth]";
import { Session } from "next-auth";
import { resolveGHApiUrl } from "@/utils/github";
import { createNewBranch } from "./newBranch";
import { upstreamOwner, upstreamRepo } from "@/config/default";

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

  const owner =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? forkResult.data.owner.login
      : upstreamOwner;

  const { fileName, filePath, srcDirPath, srcRepo } =
    resolveGHApiUrl(ghSourcePath);

  const directoryName = srcDirPath;
  const transcriptToSave = `${transcriptData.metaData.toString()}\n${
    transcriptData.body
  }\n`;

  const ghBranchData = ghBranchUrl ? resolveGHApiUrl(ghBranchUrl) : null;
  let ghBranchName = ghBranchData?.srcBranch;

  if (!ghBranchUrl) {
    // create new branch and update the branchUrl column in db
    await createNewBranch({
      octokit,
      reviewId,
      ghSourcePath,
      owner,
      session,
    })
      .then((branchUrl) => {
        const { srcBranch } = resolveGHApiUrl(branchUrl);
        ghBranchName = srcBranch;
        // ghBranchUrl = branchUrl;
      })
      .catch((err) => {
        const errMessage =
          err?.response?.data?.message ??
          err?.message ??
          "Error saving branchUrl to db";
        throw new Error(errMessage);
      });
  }

  let fileToUpdateSha = "";
  await octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: srcRepo,
      path: filePath,
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
    .then((res) => {})
    .catch((_err) => {
      console.error({ _err });
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
