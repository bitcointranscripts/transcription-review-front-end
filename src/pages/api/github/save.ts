import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/core";
import { Metadata } from "@/utils";
import { createFork } from "./fork";
import { auth } from "../auth/[...nextauth]";

type SaveEditProps = {
  octokit: InstanceType<typeof Octokit>;
  transcriptData: {
    metaData: Metadata;
    body: string;
  };
  ghSourcePath: string;
  ghBranchName?: string;
  directoryPath: string;
};

const upstreamRepo = "bitcointranscripts";

async function saveEdits({
  octokit,
  transcriptData,
  ghSourcePath,
  ghBranchName,
  directoryPath,
}: SaveEditProps) {
  const forkResult = await createFork(octokit).catch((err) => {
    throw new Error("Repo fork failed");
  });
  const owner = forkResult.data.owner.login;
  const baseBranchName = forkResult.data.default_branch;

  const filepath = new URL(ghSourcePath).pathname.split("/").slice(4);
  const srcDirName = filepath.slice(0, -1).join("/");
  const fileName = filepath.slice(-1).toString();
  const directoryName = directoryPath ? directoryPath : srcDirName;
  const transcriptToSave = `${transcriptData.metaData.toString()}\n${
    transcriptData.body
  }\n`;

  if (!ghBranchName) {
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
    const newBranchName = `${timeInSeconds}-${directoryName}`;
    const baseRefSha = baseBranch.data.object.sha;

    await octokit
      .request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        repo: upstreamRepo,
        ref: `refs/heads/${newBranchName}`,
        sha: baseRefSha,
      })
      .then(() => {
        ghBranchName = newBranchName;
      })
      .catch((_err) => {
        throw new Error("Error creating new branch");
      });

    // TODO: Update branchNameUrl Column field on review table db
  }

  const fileContent = Buffer.from(transcriptToSave).toString("base64");
  await octokit
    .request("PUT /repos/:owner/:repo/contents/:path", {
      owner,
      repo: upstreamRepo,
      path: `${directoryName}/${fileName}.md`,
      message: `Updated "${transcriptData.metaData.fileTitle}" transcript submitted by ${owner}`,
      content: fileContent,
      branch: ghBranchName,
    })
    .then()
    .catch((_err) => {
      throw new Error("Error creating new file");
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
    prRepo,
    prUrl,
    ghSourcePath,
    ghBranchName,
    directoryPath,
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
      ghBranchName,
      directoryPath,
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
