import { AxiosError } from "axios";

import { Octokit } from "@octokit/core";

import { newIndexFile } from ".";

export async function deleteIndexMdIfDirectoryEmpty(
  octokit: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  directoryPath: string,
  branch: string,
  exceptFileName: string = ""
) {
  const directoryContents = await octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: directoryPath,
      ref: branch,
    })
    .then((response) => {
      return response.data;
    });

  // Determine if the directory is empty (or only contains the _index.md and the file being moved)
  const isDirectoryEmpty =
    Array.isArray(directoryContents) &&
    directoryContents.length <= 2 &&
    directoryContents.every(
      (file) => file.name === "_index.md" || file.name === exceptFileName
    );

  if (isDirectoryEmpty) {
    // Delete the _index.md file
    const indexPath = `${directoryPath}/_index.md`;
    const indexFile = directoryContents.find(
      (file) => file.name === "_index.md"
    );
    if (indexFile) {
      await octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: indexPath,
        message: `Remove unnecessary _index.md in ${directoryPath}`,
        sha: indexFile.sha,
        branch: branch,
      });
    }
  }
}

export async function ensureIndexMdExists(
  octokit: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  directoryPath: string,
  branch: string
) {
  // Ensure each part of the path has an _index.md file
  const parts = directoryPath.split("/");
  for (const [index, part] of parts.entries()) {
    // Skip the root directory
    if (index === 0) continue;

    // Construct the path to this part of the directory
    const pathToCheck = `${parts.slice(0, index + 1).join("/")}/_index.md`;

    try {
      // Check if _index.md exists
      await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: pathToCheck,
        ref: branch,
      });
    } catch (error) {
      if ((error as AxiosError).status === 404) {
        // _index.md doesn't exist, create it
        const content = Buffer.from(newIndexFile(directoryPath)).toString(
          "base64"
        );
        await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
          owner,
          repo,
          path: pathToCheck,
          message: `Create _index.md in ${part}`,
          content: content,
          branch: branch,
        });
      } else {
        // Re-throw any other errors
        console.error(error);
        throw error;
      }
    }
  }
}

async function fetchLatestCommit(
  octokit: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  branch = "master"
) {
  const { data: refData } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/heads/{branch}",
    {
      owner,
      repo,
      branch,
    }
  );
  return refData.object.sha;
}

async function updateFork(
  octokit: InstanceType<typeof Octokit>,
  forkOwner: string,
  forkRepo: string,
  branch: string,
  latestUpstreamCommitSha: string
) {
  try {
    await octokit.request(
      "PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}",
      {
        owner: forkOwner,
        repo: forkRepo,
        branch,
        sha: latestUpstreamCommitSha,
      }
    );
  } catch (error) {
    if ((error as AxiosError).status === 422) {
      // Handle non-fast-forward updates by forcing the update
      await octokit.request(
        "PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}",
        {
          owner: forkOwner,
          repo: forkRepo,
          branch,
          sha: latestUpstreamCommitSha,
          force: true,
        }
      );
    } else {
      console.error(error);
      throw error;
    }
  }
}

export async function syncForkWithUpstream({
  octokit,
  upstreamOwner,
  upstreamRepo,
  forkOwner,
  forkRepo,
  branch = "master",
}: {
  octokit: InstanceType<typeof Octokit>;
  upstreamOwner: string;
  upstreamRepo: string;
  forkOwner: string;
  forkRepo: string;
  branch?: string;
}) {
  const latestUpstreamCommitSha = await fetchLatestCommit(
    octokit,
    upstreamOwner,
    upstreamRepo,
    branch
  );
  const latestForkCommitSha = await fetchLatestCommit(
    octokit,
    forkOwner,
    forkRepo,
    branch
  );
  if (latestUpstreamCommitSha === latestForkCommitSha) {
    return;
  }
  await updateFork(
    octokit,
    forkOwner,
    forkRepo,
    branch,
    latestUpstreamCommitSha
  );
}
