import { TransactionStatus, TransactionType } from "@/config/default";

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
  transcriptUrl: Nullable<string>;
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
  review?: Review;
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
  branchUrl: Nullable<string>;
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

export type TranscriptContent = {
  body: string;
  categories: string[];
  date: Nullable<Date>;
  media: Nullable<string>;
  speakers: string[];
  tags: string[];
  title: string;
  transcript_by: Nullable<string>;
  loc?: string;
  [x: string]: any;
};

type Nullable<T> = T | null;

export type MetadataProps = {
  fileTitle: string;
  transcript_by: string;
  url: string;
  date: string;
  tags?: string[];
  speakers?: string[];
  categories?: string[];
  [x: string]: any;
};

export type AbstractedChakraComponentProps<T> = {
  children: React.ReactNode;
} & Omit<T, "children">;

export type SelectableMetaDataType = {
  slug: string;
  value: string;
};

export type SelectableMetaDataList = {
  categories: SelectableMetaDataType[];
  speakers: SelectableMetaDataType[];
  tags: SelectableMetaDataType[];
};
export type DirectoriesDataType = {
  dir: SelectableMetaDataType[];
  code?: string;
};

// directory pattern for  state
export type IDir = {
  slug: string;
  value: string;
  nestDir?: IDir[];
};

export type UserRole = "reviewer" | "admin";

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

export type SaveToGHData = {
  directoryPath: string;
  fileName?: string;
  url: string | null;
  date:
    | string
    | {
        day: string;
        month: string;
        year: string;
      }
    | null;
  tags?: string[];
  speakers?: string[];
  categories?: string[];
  transcribedText: string;
  transcript_by?: string;
  ghSourcePath: string | null;
  ghBranchUrl: string | null;
  reviewId: number;
};

export type Identity<T> = T;

export type Flatten<T> = Identity<{
  [K in keyof T]: T[K];
}>;
