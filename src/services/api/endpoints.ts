export type ReviewQueryOptions = {
  userId?: number;
  username?: string;
  isActive?: boolean;
};

function buildReviewQueryParams(reviewQueryOptions: ReviewQueryOptions) {
  let base = "";
  let hasFilledFirstIndex = false;
  Object.keys(reviewQueryOptions).map((key) => {
    if (reviewQueryOptions[key as keyof ReviewQueryOptions]) {
      const queryString = `${key}=${
        reviewQueryOptions[key as keyof ReviewQueryOptions]
      }`;
      base += (hasFilledFirstIndex ? "&" : "?") + queryString;
      hasFilledFirstIndex = true;
    }
  });
  return base;
}

const ARCHIVE_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}/archive`;

const CLAIM_TRANSCRIPT = (id: number) => `transcripts/${id}/claim`;

const GET_TRANSCRIPTS = () => `transcripts`;

const GET_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}`;

const USERS = () => `users`;

const USER_REVIEWS = (id: number) => `users/${id}/reviews`;

const REVIEWS = ({ userId, username, isActive }: ReviewQueryOptions) => {
  return "reviews" + buildReviewQueryParams({ userId, username, isActive });
};

const REVIEW_BY_ID = (id: number) => `reviews/${id}`;

const endpoints = {
  ARCHIVE_TRANSCRIPTS_BY_ID,
  CLAIM_TRANSCRIPT,
  GET_TRANSCRIPTS,
  GET_TRANSCRIPTS_BY_ID,
  USERS,
  USER_REVIEWS,
  REVIEWS,
  REVIEW_BY_ID,
};

export default endpoints;
