import { useQuery } from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints, { ReviewQueryOptions } from "../endpoints";

const userReviews = async ({
  userId,
  username,
  status,
  page,
}: ReviewQueryOptions): Promise<UserReview> => {
  return axios
    .get(endpoints.REVIEWS({ userId, username, status, page }))
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const useUserReviews = ({
  userId,
  username,
  status,
  page,
}: ReviewQueryOptions) => {
  const queryInfo = useQuery({
    queryFn: () => userReviews({ userId, username, status, page }),
    queryKey: ["user-reviews", { userId, username, status, page }],
    enabled: Boolean(!!userId || username),
  });

  return {
    ...queryInfo,
    isLoading: queryInfo.isLoading && queryInfo.fetchStatus === "fetching",
  } as typeof queryInfo;
};
