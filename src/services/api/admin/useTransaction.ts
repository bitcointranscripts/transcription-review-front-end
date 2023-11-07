import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints, { TransactionQueryOptions } from "../endpoints";
import { Transaction } from "../../../../types";

type TranactionsResponse = {
  data: Transaction[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  page: number;
  totalPages: number;
  totalTransactions: number;
};

export const getTransaction = async ({
  userInfo,
  status,
  type,
}: TransactionQueryOptions): Promise<TranactionsResponse> => {
  return axios
    .get(endpoints.GET_TRANSACTIONS_ADMIN({ userInfo, status, type }))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetTransactions = ({
  userInfo,
  status,
  type,
}: TransactionQueryOptions) =>
  useQuery({
    queryFn: () => getTransaction({ userInfo, status, type }),
    queryKey: ["transaction", userInfo, status, type],
    refetchOnWindowFocus: false,
    enabled: true,
  });
