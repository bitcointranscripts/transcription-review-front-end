import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints, { TransactionQueryOptions } from "../endpoints";
import {
  Transaction,
  TransactionQueryStatus,
  TransactionQueryType,
} from "../../../../types";
import { TransactionStatus, TransactionType } from "@/config/default";

type TransactionsResponse = {
  data: Transaction[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  page: number;
  totalPages: number;
  totalTransactions: number;
};

type TransactionQueryFromURL = {
  userInfo: string | null;
  status: string | null;
  type: string | null;
  page: string | null;
};

export const getTransaction = async ({
  userInfo,
  status,
  type,
  page,
}: TransactionQueryFromURL): Promise<TransactionsResponse> => {
  const transactionQueryOptions = {
    userInfo: userInfo ?? undefined,
    type: Object.values(TransactionType).includes(type as TransactionQueryType)
      ? (type as TransactionQueryType)
      : undefined,
    status: Object.values(TransactionStatus).includes(
      status as TransactionQueryStatus
    )
      ? (status as TransactionQueryStatus)
      : undefined,
    page: page ? parseInt(page) - 1 ?? 0 : 0,
  };
  return axios
    .get(endpoints.GET_TRANSACTIONS_ADMIN(transactionQueryOptions))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetTransactions = ({
  userInfo,
  status,
  type,
  page,
}: TransactionQueryFromURL) =>
  useQuery({
    queryFn: () => getTransaction({ userInfo, status, type, page }),
    queryKey: ["transaction", userInfo, status, type, page],
    refetchOnWindowFocus: false,
    enabled: true,
  });
