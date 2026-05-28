import { useQuery } from "@tanstack/react-query";
import type { UserReviewData } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getReview = async (reviewId: number): Promise<UserReviewData> => {
  return axios
    .get(endpoints.REVIEW_BY_ID(reviewId))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useReview = (id: number) =>
  useQuery<UserReviewData, Error>({
    queryFn: () => getReview(id),
    queryKey: ["review", id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
