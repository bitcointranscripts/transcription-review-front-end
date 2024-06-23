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

// TODO: move this to a new folder when more endpoints are added
const transcriptionServerAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_TRANSCRIPTION_BASE_URL ?? "",
});

// Helper function to fetch transcript's metadata
const getMetadata = async (branchUrl: string): Promise<TranscriptMetadata> => {
  const response = await axios.post(`/api/github/read`, { branchUrl });
  const content = response.data.content;
  // This regex matches a markdown file with a YAML front matter.
  // It captures the YAML header and the body separately.
  const matches = /---\n([\s\S]+?)\n---/.exec(content);
  if (matches && matches[1]) {
    const metadata = yaml.load(matches[1]) as TranscriptMetadata;

    // Check if media is a YouTube link
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (youtubeRegex.test(metadata.media)) {
      try {
        // If media is a YouTube link, call the transcription server endpoint
        // to get the direct video URL and overwrite the source_file with it.
        // We need the direct video URL for media playback and YouTube links
        // are not directly usable for that purpose.
        const youtubeResponse = await transcriptionServerAxios.post(
          `/media/youtube-video-url`,
          {
            youtube_url: metadata.media,
          }
        );
        metadata.source_file = youtubeResponse.data.video_url;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch YouTube video URL"
        );
      }
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
