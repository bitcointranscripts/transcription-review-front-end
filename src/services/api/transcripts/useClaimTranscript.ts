import { useMutation } from "@tanstack/react-query";
import type { Review } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const claimTranscript = async (body: {
  userId: number;
  transcriptId: number;
  branchUrl?: string;
}): Promise<Review> => {
  return axios
    .put(endpoints.CLAIM_TRANSCRIPT(body.transcriptId), {
      claimedBy: body.userId,
      branchUrl: body.branchUrl,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const errMessage =
        err?.response?.data?.message || "Please try again later";
      throw new Error(errMessage);
    });
};

export const useClaimTranscript = () =>
  useMutation({ mutationFn: claimTranscript });
