import { useMutation } from "@tanstack/react-query";
import type { TranscriptContent } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const updateTranscript = async (body: {
  content?: TranscriptContent;
  originalContent?: TranscriptContent;
  pr_url?: string;
  transcriptId: number;
}) => {
  const { content, originalContent, pr_url } = body;
  return axios
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
      throw new Error(errMessage);
    });
};

export const useUpdateTranscript = () =>
  useMutation({ mutationFn: updateTranscript });
