import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import endpoints from "../endpoints";

const archiveTranscript = async ({
  archivedBy,
  transcriptId,
}: {
  archivedBy: number;
  transcriptId: number;
}) => {
  return axios
    .put(endpoints.ARCHIVE_TRANSCRIPTS_BY_ID(transcriptId), { archivedBy })
    .then((res) => res)
    .catch((err) => {
      const errMessage =
        err?.response?.data?.message || "Please try again later";
      throw new Error(errMessage);
    });
};

export const useArchiveTranscript = () =>
  useMutation({ mutationFn: archiveTranscript });
