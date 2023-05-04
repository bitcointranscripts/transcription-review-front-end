import axios from "@/api/axios";
import endpoints from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

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
