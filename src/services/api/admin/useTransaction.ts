import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints, { TransactionQueryOptions } from "../endpoints";
import { Transaction, TransactionQueryStatus, TransactionQueryType } from "../../../../types";
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
};

export const getTransaction = async ({
  userInfo,
  status,
  type,
}: TransactionQueryFromURL): Promise<TransactionsResponse> => {
  const transactionQueryOptions = {
    userInfo: userInfo ?? undefined,
    type: Object.values(TransactionType).includes(type as TransactionQueryType)
      ? type as TransactionQueryType
      : undefined,
    status: Object.values(TransactionStatus).includes(status as TransactionQueryStatus)
      ? status as TransactionQueryStatus
      : undefined,
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
}: TransactionQueryFromURL) =>
  useQuery({
    queryFn: () => getTransaction({ userInfo, status, type }),
    queryKey: ["transaction", userInfo, status, type],
    refetchOnWindowFocus: false,
    enabled: true,
  });
