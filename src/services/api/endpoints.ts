import { isNullOrUndefined } from "@/utils";
import { TransactionQueryStatus, TransactionQueryType } from "../../../types";

export type ReviewQueryOptions = {
  userId?: number;
  username?: string;
  status?: ReviewQueryStatus;
  page?: number;
  /* To be used for only multiple request with useQueries */
  multipleStatus?: ReviewQueryStatus[];
};

export type ReviewQueryStatus =
  | "active"
  | "pending"
  | "inactive"
  | "expired"
  | "merged"
  | "all";

export type TransactionQueryOptions = {
  userId?: number;
  userInfo?: string;
  txId?: string;
  status?: TransactionQueryStatus;
  type?: TransactionQueryType;
  page?: number;
};

export type ReviewAdminQueryOptions = {
  userId?: number;
  user?: string;
  reviewId?: string;
  status?: ReviewQueryStatus | null;
  page?: number;
  txId?: string;
};

function buildQueryParams(options: any) {
  const q = new URLSearchParams();
  for (const key of Object.keys(options)) {
    if (!isNullOrUndefined(options[key])) {
      q.set(key, options[key]);
    }
  }
  return `?${q.toString()}`;
}

const ARCHIVE_TRANSCRIPTS_BY_ID = (id: number) => `transcripts/${id}/archive`;

const ARCHIVE_REVIEWS_BY_ID = (id: number) => `reviews/${id}/reset`;

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

const GET_TRANSACTIONS_ADMIN = ({
  userInfo,
  txId,
  status,
  type,
  page,
}: TransactionQueryOptions) => {
  return (
    "transactions/all" +
    buildQueryParams({ user: userInfo, id: txId, status, type, page })
  );
};

const GET_REVIEWS_ADMIN = ({
  status,
  page,
  user,
  txId,
}: ReviewAdminQueryOptions) => {
  return (
    "reviews/all" + buildQueryParams({ status, page, user, transcriptId: txId })
  );
};

const GET_WALLET = (id?: number) => `users/${id}/wallet`;

const USER_SIGN_OUT = () => `logout`;

const endpoints = {
  ARCHIVE_TRANSCRIPTS_BY_ID,
  ARCHIVE_REVIEWS_BY_ID,
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
  GET_TRANSACTIONS_ADMIN,
  GET_REVIEWS_ADMIN,
  GET_WALLET,
  USER_SIGN_OUT,
};

export default endpoints;
