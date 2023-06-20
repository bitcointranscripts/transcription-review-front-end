import { useQuery } from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getReview = async (reviewId: number): Promise<UserReview> => {
  return axios
    .get(endpoints.REVIEW_BY_ID(reviewId))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useReview = (id: number) =>
  useQuery<UserReview, Error>({
    queryFn: () => getReview(id),
    queryKey: ["review", id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
