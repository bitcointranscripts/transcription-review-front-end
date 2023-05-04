import axios from "@/api/axios";
import endpoints from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";
import type { Review } from "../../../../types";

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
