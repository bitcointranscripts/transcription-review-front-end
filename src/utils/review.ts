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
  // checks if it is a review, NB: it is used in  the tableItems file
  if (!review?.transcript?.status) {
    return false;
  }

  const isExpired =
    !review.mergedAt &&
    review.archivedAt &&
    (isGreaterThan24Hours(review.createdAt) ||
      review.transcript.status?.toLowerCase() === "queued");

  if (review.mergedAt) {
    return "Merged";
  }
  if (
    review.transcript.status?.toLowerCase() === "not queued" &&
    !review.mergedAt &&
    review.pr_url
  ) {
    return "Pending";
  }
  if (isExpired) {
    return "Expired";
  }
  return "Active";
};
