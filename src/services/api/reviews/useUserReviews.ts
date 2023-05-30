import { useQuery } from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints, { ReviewQueryOptions } from "../endpoints";

const userReviews = async ({
  userId,
  username,
  status,
}: ReviewQueryOptions): Promise<UserReview[]> => {
  return axios
    .get(endpoints.REVIEWS({ userId, username, status }))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useUserReviews = ({
  userId,
  username,
  status,
}: ReviewQueryOptions) => {
  const queryInfo = useQuery({
    queryFn: () => userReviews({ userId, username, status }),
    queryKey: ["user-reviews", { userId, username, status }],
    enabled: Boolean(!!userId || username),
  });

  return {
    ...queryInfo,
    isLoading: queryInfo.isLoading && queryInfo.fetchStatus === "fetching",
  } as typeof queryInfo;
};
