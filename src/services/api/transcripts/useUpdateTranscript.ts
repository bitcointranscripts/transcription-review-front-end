import { useMutation } from "@tanstack/react-query";
import type { SaveToGHData, TranscriptContent } from "../../../../types";
import axiosInstance from "../axios";
import axios from "axios";
import endpoints from "../endpoints";

const updateTranscript = async (body: {
  content?: TranscriptContent;
  originalContent?: TranscriptContent;
  pr_url?: string;
  transcriptId: number;
  newImplData: SaveToGHData;
}) => {
  const { content, originalContent, pr_url, newImplData } = body;
  // handle new implementation
  if (newImplData.ghSourcePath) {
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
      ghSourcePath,
      ghBranchUrl,
      reviewId,
      ...otherMetadata
    } = newImplData;

    return axios
      .post("/api/github/save", {
        directoryPath,
        fileName,
        url,
        date,
        tags,
        speakers,
        categories,
        transcribedText,
        transcript_by,
        ghSourcePath,
        ghBranchUrl,
        reviewId,
        ...otherMetadata,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        const errMessage =
          err?.response?.data?.message || "Please try again later";
        return errMessage;
      });
  }

  // legacy save implementation
  return axiosInstance
    .put(endpoints.GET_TRANSCRIPTS_BY_ID(body.transcriptId), {
      content,
      originalContent,
      pr_url,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      const errMessage =
        err?.response?.data?.message || "Please try again later";
      return errMessage;
    });
};

export const useUpdateTranscript = () =>
  useMutation({ mutationFn: updateTranscript });
