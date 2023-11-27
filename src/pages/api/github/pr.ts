import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import { AxiosError } from "axios";

import config from "@/config/config.json";
import { Octokit } from "@octokit/core";

import {
  deriveFileSlug,
  extractPullNumber,
  Metadata,
  newIndexFile,
} from "../../../utils";
import {
  deleteIndexMdIfDirectoryEmpty,
  ensureIndexMdExists,
  syncForkWithUpstream,
} from "../../../utils/github";
import { auth } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";

async function pullAndUpdatedPR(
  octokit: InstanceType<typeof Octokit>,
  directoryPath: string,
  fileName: string,
  transcribedText: string,
  metaData: Metadata,
  pull_number: number,
  prRepo: TranscriptSubmitOptions,
  oldDirectoryList: string[]
) {
  const upstreamOwner = "bitcointranscripts";
  const upstreamRepo = "bitcointranscripts";

  // To get the owner details
  const forkResult = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner: upstreamOwner,
    repo: upstreamRepo,
  });
  const forkOwner = forkResult.data.owner.login;
  const forkRepo = upstreamRepo;
  const owner = prRepo === "user" ? forkOwner : upstreamOwner;
  const repo = prRepo === "user" ? forkRepo : upstreamRepo;

  await syncForkWithUpstream({
    octokit,
    upstreamOwner,
    upstreamRepo,
    forkOwner,
    forkRepo,
    branch: forkResult.data.default_branch,
  });

  // Fetch the pull request details
  const pullDetails = await octokit
    .request("GET /repos/:owner/:repo/pulls/:pull_number", {
      owner,
      repo,
      pull_number,
    })
    .then((data) => data)
    .catch((err) => {
      console.error(err);
      throw new Error("Error in fetching the pull request details");
    });

  if (pullDetails?.data?.merged) {
    throw new Error("Your transcript has been merged!");
  }

  const prBranch = pullDetails.data.head.ref;

  // Ensure _index.md exists in each directory level
  await ensureIndexMdExists(octokit, owner, repo, directoryPath, prBranch);

  // Construct the new file path
  const newFilePath = `${directoryPath}/${deriveFileSlug(fileName)}.md`;
  let oldFilePath;
  let oldFileSha;
  // loop through the old directory list and get the one that doesn't return a 404
  for (const directory of oldDirectoryList) {
    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path: `${directory?.trim()}/${deriveFileSlug(fileName)}.md`,
          ref: prBranch,
        }
      );
      oldFilePath = `${directory?.trim()}/${deriveFileSlug(fileName)}.md`;
      const dataWithSha = response.data as { sha: string };
      oldFileSha = dataWithSha.sha;
      break; // break out of the loop if the file is found
    } catch (error) {
      if ((error as AxiosError).status !== 404) {
        console.error(error);
        throw error; // If the old file doesn't exist, ignore the error; otherwise, rethrow
      }
      // If the file doesn't exist, continue to the next directory
    }
  }

  // If the old directory path is provided and different from the new directory path, handle the file move
  if (oldFilePath && oldFileSha) {
    // Delete the old file
    try {
      // Delete the old file using the SHA
      await octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: oldFilePath,
        message: `Remove outdated file in old directory path for ${fileName}`,
        sha: oldFileSha,
        branch: prBranch,
      });

      // check if the old directory is empty
      const oldDirectory = oldFilePath.substring(
        0,
        oldFilePath.lastIndexOf("/")
      );
      // Delete the old _index.md file if the directory is now empty
      await deleteIndexMdIfDirectoryEmpty(
        octokit,
        owner,
        repo,
        oldDirectory,
        prBranch,
        deriveFileSlug(fileName) + ".md"
      );
    } catch (error) {
      console.error(error);
      if ((error as AxiosError).status !== 404) {
        console.error(error);
        throw error; // If the old file doesn't exist, ignore the error; otherwise, rethrow
      }
    }
  }

  const fileContent = Buffer.from(`${metaData}\n${transcribedText}\n`).toString(
    "base64"
  );
  let finalResult: any;

  // Only update the file in the new directory path if the old directory path is not provided
  // or if it's the same as the new directory path
  // Get the SHA of the current file to update
  try {
    const { data: fileData } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: newFilePath,
        ref: prBranch,
      }
    );
    const dataWithSha = fileData as { sha: string };
    const fileSha = dataWithSha.sha; // Get the SHA of the existing file

    // Update the file with the new content
    finalResult = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: newFilePath,
        message: `Updated ${fileName}`,
        content: fileContent,
        branch: prBranch,
        sha: fileSha, // Provide the SHA of the existing for the update
      }
    );

    if (finalResult.status < 200 || finalResult.status > 299) {
      throw new Error("Error updating the file content");
    }
  } catch (error) {
    // If the file doesn't exist, it needs to be created instead of updated
    if ((error as AxiosError).status === 404) {
      // Update or create the file in the new directory path
      finalResult = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path: newFilePath,
          message: `Updated ${fileName}`,
          content: fileContent,
          branch: prBranch,
        }
      );
      if (finalResult.status < 200 || finalResult.status > 299) {
        throw new Error("Error updating the file content");
      }
    } else {
      console.error(error);
      throw new Error("Error updating the file content");
    }
  }

  if (oldFilePath !== newFilePath) {
    // update the pr title
    const prTitle = `Add ${deriveFileSlug(fileName)} to ${directoryPath}`;
    const prDescription = `This PR adds [${fileName}](${metaData.source}) transcript to the ${directoryPath} directory.`;
    const prResult = await octokit.request(
      "PATCH /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number,
        title: prTitle,
        body: prDescription,
      }
    );
    if (prResult.status < 200 || prResult.status > 299) {
      throw new Error("Error updating pull request title");
    }
  }

  return {
    data: {
      ...finalResult.data,
      html_url: pullDetails?.data?.html_url,
    },
  };
}

// function for creating a PR and Forking
async function createForkAndPR(
  octokit: InstanceType<typeof Octokit>,
  directoryPath: string,
  fileName: string,
  transcribedText: string,
  metaData: Metadata,
  prRepo: TranscriptSubmitOptions
) {
  const upstreamOwner = "bitcointranscripts";
  const upstreamRepo = "bitcointranscripts";
  const directoryName = directoryPath.split("/").slice(-1)[0];
  // Fork the repository
  const forkResult = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner: upstreamOwner,
    repo: upstreamRepo,
  });
  if (forkResult.status < 200 || forkResult.status > 299) {
    throw new Error("Error forking the repository");
  }
  const forkOwner = forkResult.data.owner.login;
  const forkRepo = upstreamRepo;
  const baseBranchName = forkResult.data.default_branch;

  await syncForkWithUpstream({
    octokit,
    upstreamOwner,
    upstreamRepo,
    forkOwner,
    forkRepo,
    branch: baseBranchName,
  });

  // recursion, run through path delimited by `/` and create _index.md file if it doesn't exist
  async function checkDirAndInitializeIndexFile(
    path: string,
    branch: string,
    currentLevelIdx = 0
  ) {
    let pathLevels = path.split("/");
    if (pathLevels.length > config.maximum_nested_directory_depth) {
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
        branch,
      })
      .then((_data) => true)
      .catch((err) => {
        if (err?.status === 404) {
          return false;
        }
        throw new Error("Error checking if _index.md exists");
      });

    // Create new _index.md file in given path on the branch
    if (!pathHasIndexFile) {
      const indexFile = newIndexFile(topPathLevel);
      const indexContent = Buffer.from(indexFile).toString("base64");
      await octokit
        .request("PUT /repos/:owner/:repo/contents/:path", {
          owner: forkOwner,
          repo: forkRepo,
          path: `${currentDirPath}/_index.md`,
          message: `Initialised _index.md file in ${topPathLevel} directory`,
          content: indexContent,
          branch,
        })
        .then()
        .catch((_err) => {
          throw new Error("Error creating _index.md file");
        });
    }
    await checkDirAndInitializeIndexFile(path, branch, currentLevelIdx + 1);
  }

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
  // check condition for aa pull_number
  await octokit
    .request("POST /repos/{owner}/{repo}/git/refs", {
      owner: forkOwner,
      repo: forkRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    })
    .then()
    .catch((_err) => {
      throw new Error("Error creating new branch");
    });

  // Create the file to be inserted
  const metadata = metaData.toString();
  const transcriptData = `${metadata}\n${transcribedText}\n`;
  const fileContent = Buffer.from(transcriptData).toString("base64");

  await checkDirAndInitializeIndexFile(directoryPath, newBranchName);

  // Create new file on the branch
  // const _trimmedFileName = fileName.trim();
  const fileSlug = deriveFileSlug(fileName);

  await octokit
    .request("PUT /repos/:owner/:repo/contents/:path", {
      owner: forkOwner,
      repo: forkRepo,
      path: `${directoryPath}/${fileSlug}.md`,
      message: `Added "${metaData.fileTitle}" transcript submitted by ${forkOwner}`,
      content: fileContent,
      branch: newBranchName,
    })
    .then()
    .catch((_err) => {
      throw new Error("Error creating new file");
    });

  // Create a pull request
  const prTitle = `Add ${fileSlug} to ${directoryPath}`;
  const prDescription = `This PR adds [${fileName}](${metaData.source}) transcript to the ${directoryPath} directory.`;
  const prResult = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: prRepo === "user" ? forkOwner : upstreamOwner, // update to upstreamOwner once tested
    repo: prRepo === "user" ? forkRepo : upstreamRepo,
    title: prTitle,
    body: prDescription,
    head: `${forkOwner}:${newBranchName}`,
    base: baseBranchName,
  });
  if (prResult.status < 200 || prResult.status > 299) {
    throw new Error("Error creating pull request");
  }
  return prResult;
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

  // Read directory path and fileName from the request
  const {
    directoryPath,
    oldDirectoryList,
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
  } = req.body;
  const pull_number = extractPullNumber(prUrl || "");
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
    if (!pull_number) {
      // Call the createForkAndPR function
      const prResult = await createForkAndPR(
        octokit,
        directoryPath,
        fileName,
        transcribedText,
        newMetadata,
        prRepo
      );
      // Return the result
      res.status(200).json(prResult.data);
    } else {
      const updatedPR = await pullAndUpdatedPR(
        octokit,
        directoryPath,
        fileName,
        transcribedText,
        newMetadata,
        +pull_number,
        prRepo,
        oldDirectoryList
      );
      res.status(200).json(updatedPR.data);
    }
  } catch (error: any) {
    res.status(500).json({
      message:
        error?.message ?? "Error occurred while creating the fork and PR",
    });
  }
}
