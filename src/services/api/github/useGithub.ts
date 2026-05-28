import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import yaml from "js-yaml";
import axios from "axios";
//@ts-ignore
import { converSlateToDpe, slateToMarkdown } from "slate-transcript-editor";

import {
  upstreamMetadataRepo,
  upstreamOwner,
  upstreamRepo,
} from "@/config/default";
import {
  constructDpeUrl,
  constructGithubBranchApiUrl,
  resolveGHApiUrl,
} from "@/utils/github";
import { useUserMultipleReviews } from "@/services/api/reviews";
import config from "@/config/config.json";

import backendAxios from "../axios";
import { Review, TranscriptMetadata } from "../../../../types";
import endpoints from "../endpoints";

interface BaseParams {
  transcriptUrl: string;
}

interface ClaimTranscriptParams extends BaseParams {
  transcriptId: number;
  userId: number;
}

interface SaveProgressParams extends BaseParams {
  branchUrl: string;
  metadata: TranscriptMetadata;
  transcriptSlate: any;
}

export interface SubmitReviewParams extends BaseParams {
  branchUrl: string;
  reviewId: number;
  targetRepository: string;
  metadata: TranscriptMetadata;
}

interface SuggestSourceParams
  extends Pick<TranscriptMetadata, "title" | "media"> {
  targetRepository: string;
}

const githubApi = axios.create({
  baseURL: "/api/github",
});

// API methods
const claimTranscript = async ({
  transcriptUrl,
  transcriptId,
  userId,
}: ClaimTranscriptParams): Promise<Review> => {
  // Check if the dpe.json file exists on the specific branch of the metadata repository
  const dpeUrl = constructDpeUrl(transcriptUrl);
  try {
    await githubApi.get(dpeUrl);
  } catch (error) {
    throw new Error(`The DPE file does not exist for this transcript`);
  }

  // Fork the main repository
  const forkMainRepoResult = await githubApi.post("/fork", {
    owner: upstreamOwner,
    repo: upstreamRepo,
  });
  // Fork the metadata repository
  await githubApi.post("/fork", {
    owner: upstreamOwner,
    repo: upstreamMetadataRepo,
  });

  // Create new branch from the main repository
  const { srcBranch, srcRepo, filePath, fileNameWithoutExtension } =
    resolveGHApiUrl(transcriptUrl);
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const branchName = `${timeInSeconds}-${fileNameWithoutExtension}`;
  await githubApi.post("/newBranch", {
    upstreamRepo: srcRepo,
    baseBranch: srcBranch,
    branchName,
  });
  const newBranchUrl = constructGithubBranchApiUrl({
    owner: forkMainRepoResult.data.owner.login,
    filePath,
    newBranchName: branchName,
  });
  // Create new branch from the metadata repository
  await githubApi.post("/newBranch", {
    upstreamRepo: upstreamMetadataRepo,
    // hacky way to avoid for now to keep extra information about the metadata repo in the db
    baseBranch: srcBranch == "master" ? "main" : srcBranch,
    branchName,
  });

  // Claim transcript
  const result = await backendAxios.put(
    endpoints.CLAIM_TRANSCRIPT(transcriptId),
    {
      claimedBy: userId,
      branchUrl: newBranchUrl,
    }
  );

  return result.data;
};

const saveProgress = async ({
  transcriptUrl,
  branchUrl,
  metadata,
  transcriptSlate,
}: SaveProgressParams) => {
  const { srcRepo, srcDirPath, filePath, fileNameWithoutExtension } =
    resolveGHApiUrl(transcriptUrl);
  const { srcBranch, srcOwner } = resolveGHApiUrl(branchUrl);
  // Save main branch
  const transcriptMarkdown =
    `---\n` +
    yaml.dump(
      {
        ...metadata,
        transcript_by: `${srcOwner} via ${config.app_tag}`,
        date: metadata["date"].toISOString().split("T")[0],
      },
      {
        forceQuotes: true,
      }
    ) +
    "---\n" +
    `${slateToMarkdown(transcriptSlate)}`;
  await githubApi.post("/save", {
    repo: srcRepo,
    filePath,
    fileContent: transcriptMarkdown,
    branch: srcBranch,
  });

  // Save metadata branch
  const transcriptDpe = converSlateToDpe(transcriptSlate);
  await githubApi.post("/save", {
    repo: upstreamMetadataRepo,
    filePath: `${srcDirPath}/${fileNameWithoutExtension}/dpe.json`,
    fileContent: JSON.stringify(transcriptDpe, null, 4),
    // hacky way to avoid for now to keep extra information about the metadata repo in the db
    branch: srcBranch == "master" ? "main" : srcBranch,
  });
};

const submitReview = async ({
  reviewId,
  targetRepository,
  transcriptUrl,
  branchUrl,
  metadata,
}: SubmitReviewParams) => {
  const { srcBranch: targetBranch } = resolveGHApiUrl(transcriptUrl);
  const { srcOwner, srcRepo, srcBranch, srcDirPath } =
    resolveGHApiUrl(branchUrl);
  const title = `review: "${metadata.title}" of ${srcDirPath}`;
  // submit PR on main branch
  const prResult = await githubApi.post("/pr", {
    owner: targetRepository === "user" ? srcOwner : upstreamOwner,
    repo: targetRepository === "user" ? srcRepo : upstreamRepo,
    title,
    body: `This PR is a review of the [${metadata.title}](${metadata.media}) AI-generated transcript.`,
    head: `${srcOwner}:${srcBranch}`,
    base: targetBranch,
  });
  // submit PR on metadata branch
  await githubApi.post("/pr", {
    owner: targetRepository === "user" ? srcOwner : upstreamOwner,
    // we don't have any other option here for repo because we don't currently
    // store information about the metadata branch
    repo: upstreamMetadataRepo,
    title,
    body: `This PR contains the Digital Paper Edit (DPE) format of the transcript and is used as input for the review process.
        It is not part of the evaluation process, it updates automatically and will be merged after the [review submission PR](${prResult.data.html_url}) is merged.`,
    head: `${srcOwner}:${srcBranch}`,
    // hacky way to avoid for now to keep extra information about the metadata repo in the db
    base: targetBranch == "master" ? "main" : targetBranch,
  });
  // update backend
  await backendAxios.put(endpoints.SUBMIT_REVIEW(reviewId), {
    pr_url: prResult.data.html_url,
  });
  return prResult.data.html_url;
};

const suggestSource = async ({
  title,
  media,
  targetRepository,
}: SuggestSourceParams) => {
  const result = await githubApi.post("/suggestSource", {
    title,
    media,
    targetRepository,
  });
  return result.data.pr_url;
};

export function useGithub() {
  const { data: session } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: multipleStatusData } = useUserMultipleReviews({
    userId: session?.user?.id,
    multipleStatus: ["pending", "active", "inactive"],
  });
  const mutationClaimTranscript = useMutation(claimTranscript, {
    onSuccess: async (data) => {
      try {
        if (multipleStatusData.length > 0) {
          router.push(`/reviews/${data.id}`);
        } else {
          router.push(`/reviews/${data.id}?first_review=true`);
        }
      } catch (err) {
        console.error(err);
      }
    },
    onError: (err) => {
      throw err;
    },
  });
  const mutationSaveProgress = useMutation(saveProgress, {
    onSuccess: () => {
      queryClient.invalidateQueries(["review", router.query.id]);
      toast({
        title: "Saved successfully",
        description: "Your changes have been saved.",
        status: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving changes",
        description:
          error.response?.data?.message || "An unknown error occurred.",
        status: "error",
      });
    },
  });
  const mutationSubmitReview = useMutation(submitReview, {
    onSettled: () => {
      queryClient.invalidateQueries(["review", router.query.id]);
    },
  });

  const mutationSuggestSource = useMutation(suggestSource, {
    onSuccess: (pr_url) => {
      toast({
        status: "success",
        title: "Suggestion submitted successfully",
        description: `Find your suggestion at ${pr_url}`,
      });
    },
    onError: (e) => {
      const description =
        e instanceof Error
          ? e.message
          : "An error occurred while submitting suggestion";
      toast({
        status: "error",
        title: "Error submitting",
        description,
      });
    },
  });

  return {
    claimTranscript: mutationClaimTranscript,
    saveProgress: mutationSaveProgress,
    submitReview: mutationSubmitReview,
    suggestSource: mutationSuggestSource,
  };
}
