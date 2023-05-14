export type ReviewQueryOptions = {
  userId?: number;
  username?: string;
  isActive?: boolean;
};

const ARCHIVE_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}/archive`;

const CLAIM_TRANSCRIPT = (id: number) => `transcripts/${id}/claim`;

const GET_TRANSCRIPTS = () => `transcripts`;

const GET_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}`;

const USERS = () => `users`;

const USER_REVIEWS = (id: number) => `users/${id}/reviews`;

const REVIEWS = ({ userId, username, isActive }: ReviewQueryOptions) =>
  `reviews?userId=${userId}&username=${username}&isActive=${isActive}`;

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
