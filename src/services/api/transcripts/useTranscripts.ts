import { useQuery } from "@tanstack/react-query";
import type { TranscriptData } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getAllTranscripts = async (page?: number): Promise<TranscriptData> => {
  return axios
    .get(`${endpoints.GET_TRANSCRIPTS()}?page=${page || 1}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const useTranscripts = (page?: number) =>
  useQuery({
    queryFn: () => getAllTranscripts(page),
    queryKey: ["transcripts", page],
    select: (data) => {
      return {
        totalPages: data?.totalPages,
        data: data.data.filter((transcript) =>
          Boolean(!transcript.archivedAt && !transcript.archivedBy)
        ),
      };
    },
  });
