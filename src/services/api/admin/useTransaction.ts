import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints from "../endpoints";
import {
  AdminTransaction,
  TransactionQueryStatus,
  TransactionQueryType,
} from "../../../../types";
import { TransactionStatus, TransactionType } from "@/config/default";

type TransactionsResponse = {
  data: AdminTransaction[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  page: number;
  totalPages: number;
  totalTransactions: number;
};

type TransactionQueryFromURL = {
  userInfo: string | null;
  txId: string | null;
  status: string | null;
  type: string | null;
  page: string | null;
};

export const getTransaction = async ({
  userInfo,
  txId,
  status,
  type,
  page,
}: TransactionQueryFromURL): Promise<TransactionsResponse> => {
  const transactionQueryOptions = {
    userInfo: userInfo ?? undefined,
    txId: txId ?? undefined,
    type: Object.values(TransactionType).includes(type as TransactionQueryType)
      ? (type as TransactionQueryType)
      : undefined,
    status: Object.values(TransactionStatus).includes(
      status as TransactionQueryStatus
    )
      ? (status as TransactionQueryStatus)
      : undefined,
    page: page ? parseInt(page) ?? 0 : 0,
  };
  return axios
    .get(endpoints.GET_TRANSACTIONS_ADMIN(transactionQueryOptions))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetTransactions = ({
  userInfo,
  txId,
  status,
  type,
  page,
}: TransactionQueryFromURL) =>
  useQuery({
    queryFn: () => getTransaction({ userInfo, txId, status, type, page }),
    queryKey: ["transaction", userInfo, txId, status, type, page],
    refetchOnWindowFocus: false,
    enabled: true,
  });
