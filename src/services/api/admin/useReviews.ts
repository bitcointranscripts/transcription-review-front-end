import axios from "../axios";

import { useQuery } from "@tanstack/react-query";
import endpoints from "../endpoints";
import { ReviewQueryStatus, Transcript, UserData } from "../../../../types";
import { ReviewStatus } from "@/config/default";

type AdminReviewsResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: AdminReview[];
};
type Nullable<T> = T | null;
export type AdminReview = {
  id: number;
  submittedAt: Nullable<Date>;
  archivedAt: Nullable<Date>;
  mergedAt: Nullable<Date>;
  pr_url: string;
  branchUrl: string;
  userId: number;
  transcriptId: number;
  createdAt: Date;
  updatedAt: Nullable<Date>;
  transcript: Transcript;
  user: UserData;
};
type ReviewsQueryFromURL = {
  page: string | null;
  status: string | null;
};
export const getReviews = async ({
  page,
  status,
}: ReviewsQueryFromURL): Promise<AdminReviewsResponse> => {
  const reviewsQueryOptions = {
    page: page ? parseInt(page) ?? 0 : 0,
    status: Object.values(ReviewStatus).includes(status as ReviewQueryStatus)
      ? (status as ReviewQueryStatus)
      : null,
  };
  return axios
    .get(endpoints.GET_REVIEWS_ADMIN(reviewsQueryOptions))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetAllReviews = ({ page, status }: ReviewsQueryFromURL) =>
  useQuery({
    queryFn: () => getReviews({ page, status }),
    queryKey: ["all_reviews", page, status],
    refetchOnWindowFocus: false,
    enabled: true,
  });
