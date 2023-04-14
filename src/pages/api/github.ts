import { Metadata } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Octokit } from "@octokit/core"

const fs = require("fs");

async function createForkAndPR(
  octokit: InstanceType<typeof Octokit>,
  directoryPath: string,
  fileName: string,
  transcribedText: string,
  metaData: Metadata
) {
  const upstreamOwner = "bitcointranscripts";
  const upstreamRepo = "bitcointranscripts";

  const directoryName = directoryPath.split("/").slice(-1)[0];

  // Fork the repository
  const forkResult = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner: upstreamOwner,
    repo: upstreamRepo,
  });

  const forkOwner = forkResult.data.owner.login;
  const forkRepo = upstreamRepo;

  // Get the ref for the base branch
  // a gh/network delay might cause base branch not to be availabe so run in a retry function
  // retry put on hold
  const baseBranchName = forkResult.data.default_branch;
  const baseBranch = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: forkOwner,
      repo: forkRepo,
      ref: `heads/${baseBranchName}`,
    }
  );
  // console.log(baseBranch.data)

  // Create new branch
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const newBranchName = `${timeInSeconds}-${directoryName}`;
  const baseRefSha = baseBranch.data.object.sha;

  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: forkOwner,
    repo: forkRepo,
    ref: `refs/heads/${newBranchName}`,
    sha: baseRefSha,
  });

  // // GET content of file to update
  // const { data } = await octokit.request(
  //   "GET /repos/:owner/:repo/contents/:path",
  //   {
  //     owner: forkOwner,
  //     repo: forkRepo,
  //     path: "README.md",
  //     branch: newBranchName,
  //   }
  // );

  // Make edits to the file on the new branch
  const metadata = metaData.toString();
  const transcriptData = `${metadata}\n${transcribedText}\n`;
  const fileContent = Buffer.from(transcriptData).toString("base64");
  // const { sha } = data;

  // Create new file on the branch
  const path = directoryPath.split("/").slice(1).join("/");
  const fileSlug = fileName.toLowerCase().replaceAll(" ", "-");
  await octokit.request("PUT /repos/:owner/:repo/contents/:path", {
    owner: forkOwner,
    repo: forkRepo,
    path: `${path}/${fileSlug}.md`,
    message: `Added "${metaData.fileTitle}" transcript submitted by ${forkOwner}`,
    content: fileContent,
    branch: newBranchName,
  });

  // Create a pull request
  const prTitle = `Add ${fileSlug} to ${directoryPath}`;
  const prDescription = `This PR adds [${fileName}](${metaData.source}) transcript to the ${directoryPath} directory.`;
  const prResult = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: forkOwner, // update to upstreamOwner once tested
    repo: forkRepo,
    title: prTitle,
    body: prDescription,
    head: `${forkOwner}:${newBranchName}`,
    base: baseBranchName,
  });

  return prResult;
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

  // Read directory path and fileName from the request
  const { directoryPath, fileName, url, transcribedText } = req.body;

  try {
    // Create metadata
    const newMetadata = new Metadata(
      fileName,
      session.user.githubUsername,
      url
    );

    // const dir = './tmp';
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    //   console.log("Folder tmp created successfully");
    // }

    // Call the createForkAndPR function
    const prResult = await createForkAndPR(
      octokit,
      directoryPath,
      fileName,
      transcribedText,
      newMetadata
    );
    // const prResult = await createForkAndPR(octokit, directoryPath, fileName);

    // Return the result
    // res.status(200).json("end");
    res.status(200).json(prResult.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while creating the fork and PR" });
  }
}
