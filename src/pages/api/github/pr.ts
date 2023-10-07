import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import config from "@/config/config.json";
import { deriveFileSlug, Metadata, newIndexFile } from "@/utils";
import { Octokit } from "@octokit/core";
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../auth/[...nextauth]";

async function createForkAndPR(
  octokit: InstanceType<typeof Octokit>,
  directoryPath: string,
  fileName: string,
  transcribedText: string,
  metaData: Metadata,
  prRepo: TranscriptSubmitOptions,
  prUrl: string
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

  const prUrlLength = prUrl ? prUrl.split("/").length : 1;
  //  get's the pull request files and also their SHA if they exist
  const pullFiles = await octokit
    .request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
      owner: forkOwner,
      repo: forkRepo,
      pull_number: prUrl ? +prUrl.split("/")[prUrlLength - 1] : 0,
    })
    .then((pr) => ({ data: pr?.data[0] }))
    .catch((err) => err);
  const pullRequestSHA = pullFiles?.data?.sha;
  // get details about the PR also gets the branch name (so we are able to commit)
  const pullDetails: any = await octokit
    .request("GET /repos/:owner/:repo/pulls/:pull_number", {
      owner: forkOwner,
      repo: forkRepo,
      pull_number: prUrl ? +prUrl.split("/")[prUrlLength - 1] : 0,
    })
    .then((_data) => _data)
    .catch((err) => {
      return err;
    });
  const pullRequestBranch = pullDetails?.data?.head?.ref;
  // Get the ref for the base branch
  // a gh/network delay might cause base branch not to be available so run in a retry function
  // retry put on hold
  const baseBranchName = forkResult.data.default_branch;
  const baseBranch = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: forkOwner,
      repo: forkRepo,
      ref: `heads/${prUrl ? pullRequestBranch : baseBranchName}`,
    }
  );

  // Create new branch
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const newBranchName = `${timeInSeconds}-${directoryName}`;
  const baseRefSha = baseBranch.data.object.sha;
  const branchName = pullDetails?.data?.head.ref;

  if (!prUrl) {
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: forkOwner,
      repo: forkRepo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    });
  }
  // Create the file to be inserted
  const metadata = metaData.toString();
  const transcriptData = `${metadata}\n${transcribedText}\n`;
  const fileContent = Buffer.from(transcriptData).toString("base64");

  // recursion, run through path delimited by `/` and create _index.md file if it doesn't exist
  async function checkDirAndInitializeIndexFile(
    path: string,
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
        branch: prUrl ? branchName : newBranchName,
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
        branch: prUrl ? branchName : newBranchName,
      });
    }
    await checkDirAndInitializeIndexFile(path, currentLevelIdx + 1);
  }

  await checkDirAndInitializeIndexFile(directoryPath);

  // Create new file on the branch
  // const _trimmedFileName = fileName.trim();
  const fileSlug = deriveFileSlug(fileName);
  const updateContent = await octokit.request(
    "PUT /repos/:owner/:repo/contents/:path",
    {
      owner: forkOwner,
      repo: forkRepo,
      path: `${directoryPath}/${fileSlug}.md`,
      message: `${prUrl ? "Updated" : "Added"} "${
        metaData.fileTitle
      }" transcript submitted by ${forkOwner}`,
      content: fileContent,
      branch: prUrl ? branchName : newBranchName,
      sha: prUrl ? pullRequestSHA : undefined,
    }
  );

  // Create a pull request
  const prTitle = `Add ${fileSlug} to ${directoryPath}`;
  const prDescription = `This PR adds [${fileName}](${metaData.source}) transcript to the ${directoryPath} directory.`;
  if (!prUrl) {
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
  return {
    data: { ...updateContent?.data, html_url: pullDetails?.data?.html_url },
  };
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
      newMetadata,
      prRepo,
      prUrl
    );

    // Return the result
    res.status(200).json(prResult.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message:
        error?.message ?? "Error occurred while creating the fork and PR",
    });
  }
}
