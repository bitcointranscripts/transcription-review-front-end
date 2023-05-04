import { useQuery } from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints from "../endpoints";

const userReviews = async (userId: number): Promise<UserReview[]> => {
  return axios
    .get(endpoints.USER_REVIEWS(userId))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useUserReviews = (id: number | undefined) => {
  const queryInfo = useQuery({
    queryFn: () => userReviews(Number(id)),
    queryKey: ["user-reviews", id],
    enabled: !!id,
  });

  return {
    ...queryInfo,
    isLoading: queryInfo.isLoading && queryInfo.fetchStatus === "fetching",
  } as typeof queryInfo;
};
