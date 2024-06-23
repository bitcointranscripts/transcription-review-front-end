export const TransactionType = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export const TransactionStatus = {
  SUCCESS: "success",
  PENDING: "pending",
  FAILED: "failed",
} as const;

export const FilterQueryNames = {
  page: "page",
  txId: "txId",
  size: "size",
  user: "user",
  sort: "sort",
  type: "type",
  status: "status",
  transcriptId: "transcriptId",
} as const;

export const INVOICE_PREFIX = {
  mainnet: "lnbc",
  signet: "lnbs",
} as const;

export const ReviewStatus = {
  MERGED: "merged",
  EXPIRED: "expired",
  PENDING: "pending",
  ACTIVE: "active",
  ALL: "all",
} as const;

export const upstreamOwner = "bitcointranscripts";
export const upstreamRepo = "bitcointranscripts";
export const upstreamMetadataRepo = "bitcointranscripts-metadata"
