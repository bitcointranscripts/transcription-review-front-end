import axios from "axios";
import yaml from "js-yaml";
import { useQuery } from "@tanstack/react-query";

import { constructDpeUrl } from "@/utils/github";

import type {
  UserReviewData,
  TranscriptMetadata,
  DigitalPaperEditFormat,
  TranscriptReview,
} from "../../../../types";
import backendAxios from "../axios";
import endpoints from "../endpoints";

// Helper function to fetch transcript's metadata
const getMetadata = async (branchUrl: string): Promise<TranscriptMetadata> => {
  const response = await axios.post(`/api/github/read`, { branchUrl });
  const content = response.data.content;
  // This regex matches a markdown file with a YAML front matter.
  // It captures the YAML header and the body separately.
  const matches = /---\n([\s\S]+?)\n---/.exec(content);
  if (matches && matches[1]) {
    const metadata = yaml.load(matches[1]) as TranscriptMetadata;

    // If media is a YouTube link, leave source_file unset so the background
    // hook (useYoutubeVideoUrl) can resolve the direct URL after page load.
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(metadata.media)) {
      metadata.source_file = metadata.media;
    }

    return metadata;
  } else {
    throw new Error("No metadata found");
  }
};

// Helper function to fetch the  Digital Paper Edit format of the transcript
const getDPEContent = async (
  branchUrl: string
): Promise<DigitalPaperEditFormat> => {
  const response = await axios.post(`/api/github/read`, { branchUrl });
  return response.data.content;
};

// Main function to fetch review details
const getReviewData = async (reviewId: number): Promise<TranscriptReview> => {
  try {
    const reviewData: UserReviewData = await backendAxios
      .get(endpoints.REVIEW_BY_ID(reviewId))
      .then((res) => res.data);

    if (!reviewData.branchUrl) {
      throw new Error("No branch has been created for this review");
    }

    // Fetch both metadata and DPE content in parallel
    const dpeUrl = constructDpeUrl(reviewData.branchUrl);
    const [metadata, dpe] = await Promise.all([
      getMetadata(reviewData.branchUrl),
      getDPEContent(dpeUrl),
    ]);

    // Combine data and return
    // We don't make use of the "transcript" object returned by the backend
    // so here we replace it with data that we get directly from GitHub
    // TODO: In the future remove this reduntant information from the response
    //       or fetch the GitHub data in the backend instead of here
    return {
      ...reviewData,
      transcript: { metadata, dpe, url: reviewData.transcript.transcriptUrl },
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch review data"
    );
  }
};

export const useReview = (reviewId: number) =>
  useQuery<TranscriptReview, Error>({
    queryFn: () => getReviewData(reviewId),
    queryKey: ["review", reviewId],
    refetchOnWindowFocus: false,
    enabled: !!reviewId,
  });
