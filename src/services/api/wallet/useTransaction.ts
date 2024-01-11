import axios from "../axios";
import axiosBase from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useGetTransactions = (id: number) =>
  useQuery<Transaction[], Error>({
    queryFn: () => getTransaction(id),
    queryKey: ["transaction", id],
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

export const payInvoice = async ({
  amount,
  callbackUrl,
}: {
  amount: string;
  callbackUrl: string;
}): Promise<any> => {
  return axiosBase
    .post("/api/lightning/withdraw", { amount, callbackUrl })
    .then((res) => res.data)
    .catch((err) => err);
};

export const usePayInvoice = () =>
  useMutation({
    mutationFn: payInvoice,
  });
export const withdrawSats = async ({
  invoice,
  userId,
}: {
  userId?: number;
  invoice?: string;
}): Promise<any> => {
  return axios
    .post(endpoints.PAY_INVOICE(), { userId, invoice })
    .then((res) => res.data)
    .catch((err) => err);
};

export const useWithdrawSats = () =>
  useMutation({
    mutationFn: withdrawSats,
  });

export const validateAddress = async ({
  lnAddress,
}: {
  lnAddress: string;
}): Promise<any> => {
  return axiosBase
    .post("/api/lightning/validate-address", { lnAddress })
    .then((res) => res.data)
    .catch((err) => err);
};

export const useValidateAddress = () =>
  useMutation({
    mutationFn: validateAddress,
  });
