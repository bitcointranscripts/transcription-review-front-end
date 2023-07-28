import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints from "../endpoints";
import { Transaction } from "../../../../types";

export const getTransaction = async (
  userId: number
): Promise<Transaction[]> => {
  return axios
    .get(endpoints.GET_TRANSACTIONS({ userId }))
    .then((res) => res.data)
    .catch((err) => err);
};

export const payInvoice = async (
  userId?: number,
  invoice?: string
): Promise<any> => {
  return axios
    .post(endpoints.PAY_INVOICE(), { userId, invoice })
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetTransactions = (id: number) =>
  useQuery<Transaction[], Error>({
    queryFn: () => getTransaction(id),
    queryKey: ["transaction", id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
