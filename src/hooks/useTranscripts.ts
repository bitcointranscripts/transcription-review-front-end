import endpoints from "@/api/endpoints";
import { useMutation, useQuery } from "react-query";
import { Review, Transcript } from "../../types";
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

  const addReview = async (body: { userId: number; transcriptId: number }): Promise<Review> => {
    return axios
      .post(endpoints.REVIEWS(), body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        const errMessage =
          err?.response?.data?.message || "Please try again later";
        throw new Error(errMessage);
      });
  };

  const archive = async ({
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

  const transcripts = useQuery("transcripts", getAllTranscripts, {
    refetchOnWindowFocus: false,
  });
  const activeTranscripts = useQuery("active_transcripts", getAllTranscripts, {
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.filter((transcript) =>
        Boolean(!transcript.archivedAt && !transcript.archivedBy)
      );
    },
  });

  const SingleTranscript = (transcriptId: number, enabled: boolean = true) =>
    useQuery<Transcript, Error>(
      ["transcript", transcriptId],
      () => getSingleTranscripts(transcriptId),
      {
        refetchOnWindowFocus: false,
        enabled,
      }
    );

  const claimTranscript = useMutation(addReview);

  const updateTranscript = useMutation(saveEdit);

  const archiveTranscript = useMutation(archive);

  return {
    activeTranscripts,
    archiveTranscript,
    transcripts,
    SingleTranscript,
    claimTranscript,
    updateTranscript,
  };
};

export default useTranscripts;
