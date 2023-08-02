export type ReviewQueryOptions = {
  userId?: number;
  username?: string;
  status?: "active" | "pending" | "inactive";
  page?: number;
};

export type TransactionQueryOptions = {
  userId?: number;
  status?: "success" | "pending" | "failed";
  type?: "credit" | "debit";
};

function buildQueryParams(options: any) {
  let base = "";
  let hasFilledFirstIndex = false;
  Object.keys(options).map((key) => {
    if (options[key]) {
      const queryString = `${key}=${options[key]}`;
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

const USER_SIGN_UP = () => `users/signup`;

const USER_SIGN_IN = () => `users/signin`;

const USER_BY_ID = (id: number) => `users/${id}`;

const USER_REVIEWS = (id: number) => `users/${id}/reviews`;

const REVIEWS = ({ userId, username, status, page }: ReviewQueryOptions) => {
  return "reviews" + buildQueryParams({ userId, username, status, page });
};

const REVIEW_BY_ID = (id: number) => `reviews/${id}`;

const SUBMIT_REVIEW = (id: number) => `reviews/${id}/submit`;

const PAY_INVOICE = () => `lightning/invoice/pay`;

const GET_TRANSACTIONS = ({
  userId,
  status,
  type,
}: TransactionQueryOptions) => {
  return "transactions" + buildQueryParams({ userId, status, type });
};

const GET_WALLET = (id?: number) => `users/${id}/wallet`;

const USER_SIGN_OUT = () => `logout`;

const endpoints = {
  ARCHIVE_TRANSCRIPTS_BY_ID,
  CLAIM_TRANSCRIPT,
  GET_TRANSCRIPTS,
  GET_TRANSCRIPTS_BY_ID,
  USERS,
  USER_SIGN_UP,
  USER_SIGN_IN,
  USER_BY_ID,
  USER_REVIEWS,
  REVIEWS,
  REVIEW_BY_ID,
  SUBMIT_REVIEW,
  PAY_INVOICE,
  GET_TRANSACTIONS,
  GET_WALLET,
  USER_SIGN_OUT,
};

export default endpoints;
