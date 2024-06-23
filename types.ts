import {
  ReviewStatus,
  TransactionStatus,
  TransactionType,
} from "@/config/default";
import { AdminReview } from "@/services/api/admin/useReviews";

export type Transcript = {
  id: number;
  archivedAt: Nullable<Date>;
  archivedBy: Nullable<number>;
  createdAt: Nullable<Date>;
  content: TranscriptContent;
  status?: "queued" | "not queued" | "requeued";
  updatedAt: Nullable<Date>;
  originalContent: TranscriptContent;
  transcriptHash: string;
  claimedBy: Nullable<number>;
  contentTotalWords: number;
  transcriptUrl: string;
};
export type TranscriptData = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: Transcript[];
};
export type ReviewTranscript = Transcript & {
  review: Review;
};

export type Review = {
  id: number;
  userId: number;
  transcriptId: number;
  archivedAt: Nullable<Date>;
  updatedAt: Nullable<Date>;
  createdAt: Date;
  claimedAt: Nullable<Date>;
  submittedAt: Nullable<Date>;
  mergedAt: Nullable<Date>;
  pr_url: Nullable<string>;
  branchUrl: string;
};

export type TranscriptReview = Review & {
  transcript: {
    dpe: DigitalPaperEditFormat;
    metadata: TranscriptMetadata;
    url: string;
  };
};

export type UserReviewData = Review & {
  transcript: Transcript;
};

export type UserReview = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: UserReviewData[];
};

export type TranscriptContent = Record<string, any> & {
  body: string;
  categories: string[];
  date: Nullable<Date>;
  media: Nullable<string>;
  speakers: string[];
  tags: string[];
  title: string;
  transcript_by: Nullable<string>;
  loc?: string;
};

export type TranscriptMetadata = {
  date: Date;
  source_file: string;
  media: string;
  speakers: string[];
  tags: string[];
  title: string;
  transcript_by: string;
};

export type DigitalPaperEditWord = {
  id: number;
  start: number;
  end: number;
  text: string;
};

export type DigitalPaperEditParagraph = {
  id: number;
  start: number;
  end: number;
  speaker: string;
};

export type DigitalPaperEditFormat = {
  words: DigitalPaperEditWord[];
  paragraphs: DigitalPaperEditParagraph[];
};

export type SlateNode = {
  children: { text: string; words: DigitalPaperEditWord[] };
  speaker: string;
  start: number;
  startTimecode: string;
  previousTimings: string;
  type: string;
  chapter?: string;
};

type Nullable<T> = T | null;

export type AbstractedChakraComponentProps<T> = {
  children: React.ReactNode;
} & Omit<T, "children">;

export type SelectableMetadataType = {
  slug: string;
  value: string;
};

export type SelectableMetadataList = {
  categories: SelectableMetadataType[];
  speakers: SelectableMetadataType[];
  tags: SelectableMetadataType[];
  media: string[];
};
export type DirectoriesDataType = {
  dir: SelectableMetadataType[];
  code?: string;
};

// directory pattern for  state
export type IDir = {
  slug: string;
  value: string;
  nestDir?: IDir[];
};

export const UserRoles = {
  reviewer: "reviewer",
  evaluator: "evaluator",
  admin: "admin",
};

export type UserRole = keyof typeof UserRoles;

export type UserData = {
  permissions: UserRole;
  id: number;
  email: string;
  githubUsername: string;
  updatedAt: string;
  createdAt: string;
  authToken?: string | null;
  jwt?: string | null;
  archivedAt?: string | null;
};

export type UserSessionType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: number;
  permissions?: string;
  githubUsername?: string;
  jwt?: string;
};

export type DecodedJWT = {
  userId: number;
  permissions: UserRole;
  githubAuthToken: string;
  isEmailPresent: boolean;
  iat: number;
  exp: number;
};

export type Wallet = {
  id: string;
  balance: number;
  userId: number;
  transactions: Transaction[];
};

export type Transaction = {
  id: string;
  walletId: string;
  reviewId: number;
  amount: string;
  transactionType: "credit" | "debit";
  transactionStatus: "success" | "pending" | "failed";
  createdAt: string;
  updatedAt: string;
};
export type AdminTransaction = Transaction & {
  wallet: {
    id: string;
    user: {
      email: string;
      githubUsername: string;
      id: string;
      permissions: UserRole;
    };
  };
};

export type TransactionQueryType =
  (typeof TransactionType)[keyof typeof TransactionType];

export type TransactionQueryStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Reviews for admin;
export type ReviewQueryStatus =
  (typeof ReviewStatus)[keyof typeof ReviewStatus];

export type GroupedDataType = {
  review: AdminReview | Review;
  transcriptUrl?: Nullable<string>;
  content?: TranscriptContent;
};
