import { useQuery } from "@tanstack/react-query";
import type { Review } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const getReview = async (reviewId: number): Promise<Review> => {
  return axios
    .get(endpoints.REVIEWS(reviewId))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useReview = (id: number) =>
  useQuery<Review, Error>({
    queryFn: () => getReview(id),
    queryKey: ["review", id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
