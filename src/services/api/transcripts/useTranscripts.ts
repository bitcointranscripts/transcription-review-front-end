import { useQuery } from "@tanstack/react-query";
import type { Transcript } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getAllTranscripts = async (): Promise<Transcript[]> => {
  return axios
    .get(endpoints.GET_TRANSCRIPTS())
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
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
