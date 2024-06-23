import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";

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

import backendAxios from "../axios";
import { Review } from "../../../../types";
import endpoints from "../endpoints";

interface BaseParams {
  transcriptUrl: string;
}

interface ClaimTranscriptParams extends BaseParams {
  transcriptId: number;
  userId: number;
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

export function useGithub() {
  const { data: session } = useSession();
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

  return {
    claimTranscript: mutationClaimTranscript,
  };
}
