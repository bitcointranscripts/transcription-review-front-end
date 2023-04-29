import endpoints from "@/api/endpoints";
import { useQuery } from "react-query";
import { Review } from "../../types";
import axios from "../api/axios";

const useReviews = () => {
  const getSingleReview = async (reviewId: number): Promise<Review> => {
    return axios
      .get(endpoints.REVIEWS(reviewId))
      .then((res) => res.data)
      .catch((err) => err);
  };

  const SingleReview = (reviewId: number, enabled: boolean = true) =>
    useQuery<Review, Error>(
      ["review", reviewId],
      () => getSingleReview(reviewId),
      {
        refetchOnWindowFocus: false,
        enabled,
      }
    );

  return {
    SingleReview,
  };
};

export default useReviews;
