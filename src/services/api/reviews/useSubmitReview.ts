import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import endpoints from "../endpoints";

const submitReview = async (body: { reviewId: number; pr_url: string }) => {
  const { reviewId, pr_url } = body;
  return axios
    .put(endpoints.SUBMIT_REVIEW(reviewId), {
      pr_url,
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

export const useSubmitReview = () => useMutation({ mutationFn: submitReview });
