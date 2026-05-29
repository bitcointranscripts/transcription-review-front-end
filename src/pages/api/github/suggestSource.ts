import type { NextApiRequest, NextApiResponse } from "next";
import yaml from "js-yaml";
import { getOctokit } from "@/utils/getOctokit";
import { upstreamOwner, upstreamRepo } from "@/config/default";
import { deriveFileSlug } from "@/utils";
import { createNewBranch } from "./newBranch";
import { withGithubErrorHandler } from "@/utils/githubApiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { octokit, owner } = await getOctokit(req, res, {
    allowAppFallback: true,
  });
  const { title, media, targetRepository } = req.body;

  if (owner !== upstreamOwner) {
    // Fork the main repository
    await octokit.request("POST /repos/{owner}/{repo}/forks", {
      owner: upstreamOwner,
      repo: upstreamRepo,
    });
  }

  // Create new branch
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const fileName = deriveFileSlug(title);
  const branchName = `${timeInSeconds}-${fileName}`;
  await createNewBranch({
    octokit,
    upstreamRepo,
    baseBranch:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "master"
        : "staging",
    branchName,
    owner,
  });

  // Save file
  const transcriptMarkdown =
    `---\n` +
    yaml.dump(
      {
        title,
        media,
        needs: "transcript",
      },
      {
        forceQuotes: true,
      }
    ) +
    "---\n";

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo: upstreamRepo,
    path: `misc/${fileName}.md`,
    message: `curate(transcript): "${title}"`,
    content: Buffer.from(transcriptMarkdown).toString("base64"),
    branch: branchName,
  });

  // Open PR with user's suggestion
  const prResult = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: targetRepository === "user" ? owner : upstreamOwner,
    repo: upstreamRepo,
    title: `curate(transcript): "${title}"`,
    body: `This PR is a suggestion for the transcription of [${title}](${media}).`,
    head: `${owner}:${branchName}`,
    base:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "master"
        : "staging",
  });

  res.status(200).json({
    message: "Suggestion submitted successfully",
    pr_url: prResult.data.html_url,
  });
}

export default withGithubErrorHandler(
  handler,
  "Error occurred while submitting suggestion"
);
