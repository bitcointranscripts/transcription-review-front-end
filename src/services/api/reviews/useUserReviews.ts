import { useQuery } from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints, { ReviewQueryOptions } from "../endpoints";

const userReviews = async ({
  userId,
  username,
  isActive,
}: ReviewQueryOptions): Promise<UserReview[]> => {
  return axios
    .get(endpoints.REVIEWS({ userId, username, isActive }))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useUserReviews = ({
  userId,
  username,
  isActive,
}: ReviewQueryOptions) => {
  const queryInfo = useQuery({
    queryFn: () => userReviews({ userId, username, isActive }),
    queryKey: ["user-reviews", { userId, username, isActive }],
    select: (data) => {
      return data.filter((item) =>
        Boolean(!item.transcript.archivedAt && !item.transcript.archivedBy)
      );
    },
    enabled: Boolean(!!userId || username),
  });

  return {
    ...queryInfo,
    isLoading: queryInfo.isLoading && queryInfo.fetchStatus === "fetching",
  } as typeof queryInfo;
};
