import { Metadata, newIndexFile } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Octokit } from "@octokit/core";
import slugify from "slugify";

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

  // Create the file to be inserted
  const metadata = metaData.toString();
  const transcriptData = `${metadata}\n${transcribedText}\n`;
  const fileContent = Buffer.from(transcriptData).toString("base64");

  // recursion, run through path delimited by `/` and create _index.md file if it doesn't exist
  async function checkDirAndInitializeIndexFile(
    path: string,
    currentLevelIdx = 0,
    maxNesting = 6
  ) {
    let pathLevels = path.split("/");
    if (pathLevels.length > maxNesting) {
      throw new Error("maximum nested directory depth reached");
    }
    const topPathLevel = pathLevels[currentLevelIdx];
    if (!topPathLevel) return;
    const currentDirPath = pathLevels.slice(0, currentLevelIdx + 1).join("/");

    // Check if _index.md exists in file
    const pathHasIndexFile = await octokit
      .request("GET /repos/:owner/:repo/contents/:path", {
        owner: forkOwner,
        repo: forkRepo,
        path: `${currentDirPath}/_index.md`,
        branch: newBranchName,
      })
      // eslint-disable-next-line no-unused-vars
      .then((_data) => true)
      .catch((err) => {
        if (err?.status === 404) {
          return false;
        }
        throw err;
      });

    // Create new _index.md file in given path on the branch
    if (!pathHasIndexFile) {
      const indexFile = newIndexFile(topPathLevel);
      const indexContent = Buffer.from(indexFile).toString("base64");
      await octokit.request("PUT /repos/:owner/:repo/contents/:path", {
        owner: forkOwner,
        repo: forkRepo,
        path: `${currentDirPath}/_index.md`,
        message: `Initialised _index.md file in ${topPathLevel} directory`,
        content: indexContent,
        branch: newBranchName,
      });
    }
    await checkDirAndInitializeIndexFile(path, currentLevelIdx + 1);
  }

  await checkDirAndInitializeIndexFile(directoryPath);

  // Create new file on the branch
  const _trimmedFileName = fileName.trim();
  const fileSlug = slugify(_trimmedFileName).replace(/[^\w-]+/g, "");
  await octokit.request("PUT /repos/:owner/:repo/contents/:path", {
    owner: forkOwner,
    repo: forkRepo,
    path: `${directoryPath}/${fileSlug}.md`,
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
  const {
    directoryPath,
    fileName,
    url,
    date,
    tags,
    speakers,
    categories,
    transcribedText,
    transcript_by,
  } = req.body;

  try {
    // Create metadata
    const newMetadata = new Metadata({
      fileTitle: fileName,
      transcript_by: transcript_by,
      url,
      date,
      tags,
      speakers,
      categories,
    });

    // Call the createForkAndPR function
    const prResult = await createForkAndPR(
      octokit,
      directoryPath,
      fileName,
      transcribedText,
      newMetadata
    );

    // Return the result
    res.status(200).json(prResult.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while creating the fork and PR" });
  }
}
