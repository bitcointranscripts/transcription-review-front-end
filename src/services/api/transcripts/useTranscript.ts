import { useQuery } from "@tanstack/react-query";
import type { Transcript } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getSingleTranscripts = async (
  transcriptId: number
): Promise<Transcript> => {
  return axios
    .get(endpoints.GET_TRANSCRIPTS_BY_ID(transcriptId || 0))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useTranscript = (transcriptId: number) =>
  useQuery<Transcript, Error>({
    queryFn: () => getSingleTranscripts(transcriptId),
    queryKey: ["transcript", transcriptId],
    refetchOnWindowFocus: false,
  });
