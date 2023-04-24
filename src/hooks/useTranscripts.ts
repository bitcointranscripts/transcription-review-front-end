import endpoints from "@/api/endpoints";
import { useMutation, useQuery } from "react-query";
import { Transcript } from "../../types";
import axios from "../api/axios";

const useTranscripts = () => {
  const getAllTranscripts = async (): Promise<Transcript[]> => {
    return axios
      .get(endpoints.GET_TRANSCRIPTS())
      .then((res) => res.data)
      .catch((err) => err);
  };
  const getSingleTranscripts = async (
    transcriptId: number
  ): Promise<Transcript> => {
    return axios
      .get(endpoints.GET_TRANSCRIPTS_BY_ID(transcriptId || 0))
      .then((res) => res.data)
      .catch((err) => err);
  };

  const addReview = async (body: { userId: number; transcriptId: number }) => {
    return axios
      .post(endpoints.REVIEWS(), body)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        const errMessage =
          err?.response?.data?.message || "Please try again later";
        return new Error(errMessage);
      });
  };

  const saveEdit = async (body: {
    content: any;
    originalContent?: any;
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

  const transcripts = useQuery("trancripts", getAllTranscripts, {
    refetchOnWindowFocus: false,
  });
  const activeTranscripts = useQuery("active_trancripts", getAllTranscripts, {
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.filter((transcript) =>
        Boolean(!transcript.archivedAt && !transcript.archivedBy)
      );
    },
  });

  const SingleTranscript = (transcriptId: number) =>
    useQuery(
      ["transcript", transcriptId],
      () => getSingleTranscripts(transcriptId),
      {
        refetchOnWindowFocus: false,
      }
    );

  const claimTranscript = useMutation(addReview);

  const updateTranscript = useMutation(saveEdit);

  return {
    transcripts,
    activeTranscripts,
    SingleTranscript,
    claimTranscript,
    updateTranscript,
  };
};

export default useTranscripts;
