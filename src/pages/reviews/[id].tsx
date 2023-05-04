/* eslint-disable no-unused-vars */
import RedirectToLogin from "@/components/RedirectToLogin";
import Transcript from "@/components/transcript";
import AuthStatus from "@/components/transcript/AuthStatus";
import { useReview } from "@/services/api/reviews";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const TranscriptPage = () => {
  const { status, data: sessionData } = useSession();
  const router = useRouter();
  const { id } = router.query;

  // get the review only if id is a number
  const { data: review, status: reviewStatus, error } = useReview(Number(id));

  if (status === "loading" || reviewStatus === "loading") {
    return <AuthStatus title="Authenticating" message="Please wait" />;
  }
  if (status === "unauthenticated" || !sessionData?.user?.id) {
    return <RedirectToLogin />;
  }

  if (
    reviewStatus === "success" &&
    review?.userId &&
    review?.userId !== sessionData?.user.id
  ) {
    return (
      <AuthStatus
        title="Unauthorized"
        message="You are not authorized to access this review"
      />
    );
  }

  if (review?.submittedAt || review?.mergedAt) {
    return (
      <AuthStatus title="Error" message="This review is no longer active" />
    );
  }

  if (review?.transcriptId) {
    return <Transcript transcriptId={review.transcriptId} />;
  }

  return (
    <AuthStatus
      title="Error"
      message={`${
        error?.message
          ? error.message
          : "Something went wrong. Please try again later"
      }`}
    />
  );
};

export default TranscriptPage;
