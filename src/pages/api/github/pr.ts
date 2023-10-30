import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import config from "@/config/config.json";
import {
  deriveFileSlug,
  extractPullNumber,
  Metadata,
  newIndexFile,
} from "@/utils";
import { Octokit } from "@octokit/core";
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../auth/[...nextauth]";

// functions for an already open PR
async function pullAndUpdatedPR(
  octokit: InstanceType<typeof Octokit>,
  directoryPath: string,
  fileName: string,
  transcribedText: string,
  metaData: Metadata,
  pull_number: number
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
  const pullFiles = await octokit
    .request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
      owner: forkOwner,
      repo: forkRepo,
      pull_number,
    })
    .then((pr) => ({ data: pr?.data[0] }))
    .catch((err) => {
      throw err;
    });

  const pullDetails: any = await octokit
    .request("GET /repos/:owner/:repo/pulls/:pull_number", {
      owner: forkOwner,
      repo: forkRepo,
      pull_number,
    })
    .then((_data) => _data)
    .catch((err) => {
      throw err;
    });
  if (pullDetails?.data?.merged) {
    throw new Error("Your transcript has been merged!");
  }
  const pullRequestSHA = pullFiles?.data?.sha;
  const pullRequestBranch = pullDetails?.data?.head?.ref;
  // Create the file to be inserted
  const metadata = metaData.toString();
  const transcriptData = `${metadata}\n${transcribedText}\n`;
  const fileContent = Buffer.from(transcriptData).toString("base64");

  const fileSlug = deriveFileSlug(fileName);
  const updateContent = await octokit.request(
    "PUT /repos/:owner/:repo/contents/:path",
    {
      owner: forkOwner,
      repo: forkRepo,
      path: `${directoryPath}/${fileSlug}.md`,
      message: ` Updated  "${metaData.fileTitle}" transcript submitted by ${forkOwner}`,
      content: fileContent,
      branch: pullRequestBranch,
      sha: pullRequestSHA,
    }
  );
  return {
    data: {
      ...updateContent?.data,
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
  const forkOwner = forkResult.data.owner.login;
  const forkRepo = upstreamRepo;
  const baseBranchName = forkResult.data.default_branch;
  // recursion, run through path delimited by `/` and create _index.md file if it doesn't exist
  async function checkDirAndInitializeIndexFile(
    path: string,
    branch: string,
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
        branch,
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
        branch,
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
        branch,
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

  await checkDirAndInitializeIndexFile(directoryPath, newBranchName);
  await checkDirAndInitializeIndexFile(directoryPath, newBranchName);

  // Create new file on the branch
  // const _trimmedFileName = fileName.trim();
  const fileSlug = deriveFileSlug(fileName);
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
    owner: prRepo === "user" ? forkOwner : upstreamOwner, // update to upstreamOwner once tested
    repo: prRepo === "user" ? forkRepo : upstreamRepo,
    title: prTitle,
    body: prDescription,
    head: `${forkOwner}:${newBranchName}`,
    base: baseBranchName,
  });
  return prResult;
  const prResult = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: prRepo === "user" ? forkOwner : upstreamOwner, // update to upstreamOwner once tested
    repo: prRepo === "user" ? forkRepo : upstreamRepo,
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
  const session = await auth(req, res);
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
    prRepo,
    prUrl,
  } = req.body;
  const pull_number = extractPullNumber(prUrl || "");
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
        +pull_number
      );
      res.status(200).json(updatedPR.data);
    }
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
        +pull_number
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
