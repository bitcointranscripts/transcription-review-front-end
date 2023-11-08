export const TransactionType = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export const TransactionStatus = {
  SUCCESS: "success",
  PENDING: "pending",
  FAILED: "failed",
} as const;
