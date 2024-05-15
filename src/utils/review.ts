import { AdminReview } from "@/services/api/admin/useReviews";

function isGreaterThan24Hours(date: Date): boolean | null {
  if (!date) return null;

  const createdReview = new Date(date);
  const now = new Date();
  const differenceInMillis = now.getTime() - createdReview.getTime();

  const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

  return differenceInMillis > millisecondsIn24Hours;
}

export const getReviewStatus = (review: AdminReview) => {
  if (review.mergedAt) {
    return "Merged";
  } else if (
    review.transcript.status?.toLowerCase() === "not queued" &&
    !review.mergedAt &&
    review.pr_url
  ) {
    return "Pending";
  } else if (isGreaterThan24Hours(review.createdAt) && !review.mergedAt) {
    return "Expired";
  } else {
    return "Active";
  }
};
