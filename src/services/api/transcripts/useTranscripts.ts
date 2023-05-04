import axios from "@/api/axios";
import endpoints from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";
import type { Transcript } from "../../../../types";

const getAllTranscripts = async (): Promise<Transcript[]> => {
  return axios
    .get(endpoints.GET_TRANSCRIPTS())
    .then((res) => res.data)
    .catch((err) => err);
};

export const useTranscripts = () =>
  useQuery({
    queryFn: getAllTranscripts,
    queryKey: ["transcripts"],
    select: (data) => {
      return data.filter((transcript) =>
        Boolean(!transcript.archivedAt && !transcript.archivedBy)
      );
    },
  });
