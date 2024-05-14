import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import endpoints from "../endpoints";

const resetReview = async ({ reviewId }: { reviewId: number }) => {
  return axios
    .post(endpoints.ARCHIVE_REVIEWS_BY_ID(reviewId))
    .then((res) => res)
    .catch((err) => {
      const errMessage =
        err?.response?.data?.message || "Please try again later";
      throw new Error(errMessage);
    });
};

export const useResetReview = () => useMutation({ mutationFn: resetReview });
