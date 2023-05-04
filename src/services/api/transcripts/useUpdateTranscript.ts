import axios from "@/api/axios";
import endpoints from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import type { TranscriptContent } from "../../../../types";

const updateTranscript = async (body: {
  content: TranscriptContent;
  originalContent?: TranscriptContent;
  transcriptId: number;
}) => {
  const { content, originalContent } = body;
  return axios
    .put(endpoints.GET_TRANSCRIPTS_BY_ID(body.transcriptId), {
      content,
      originalContent,
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
