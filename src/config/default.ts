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
  size: "size",
  user: "user",
  sort: "sort",
  type: "type",
  status: "status",
} as const;
