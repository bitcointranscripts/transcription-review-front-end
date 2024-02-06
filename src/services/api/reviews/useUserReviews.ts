import config from "@/config/config.json";
import {
  RefetchOptions,
  RefetchQueryFilters,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import type { UserReview } from "../../../../types";
import axios from "../axios";
import endpoints, { ReviewQueryOptions } from "../endpoints";
import { isReviewActive } from "@/utils";

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

// Multiple calls with promises
export const useUserMultipleReviews = ({
  userId,
  username,
  multipleStatus,
  page,
}: ReviewQueryOptions) => {
  const multipleStatusArray = multipleStatus || [];
  const queryInfo = useQueries({
    queries: multipleStatusArray.map((status) => {
      return {
        queryFn: () => userReviews({ userId, username, status, page }),
        queryKey: ["user-reviews", { userId, username, status, page }],
        enabled: Boolean(!!userId || username),
      };
    }),
  });

  const result = queryInfo.map((result) => result.data?.data ?? []).flat();
  const refetch = async <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => {
    return queryInfo[0].refetch(options);
  };
  return {
    data: result,
    isLoading: queryInfo.some(
      (query) => query.isLoading && query.fetchStatus === "fetching"
    ),
    refetch,
    isError: queryInfo.some((query) => query.isError),
  };
};

export const useHasExceededMaxActiveReviews = (userId: number | undefined) => {
  const { data: allReviews = { data: [] } } = useUserReviews({
    userId,
  });
  const activeReviews = allReviews?.data?.filter(isReviewActive);
  return activeReviews.length >= config.max_active_reviews;
};
