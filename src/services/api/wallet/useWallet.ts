import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints from "../endpoints";
import { Wallet } from "../../../../types";

const getWallet = async (userId?: number): Promise<Wallet> => {
  const txResponse = axios.get(endpoints.GET_TRANSACTIONS({ userId }));
  const walletResponse = axios.get(endpoints.GET_WALLET(userId));
  if (txResponse && walletResponse) {
    return Promise.all([txResponse, walletResponse])
      .then((res) => {
        const transactions = res[0].data;
        const wallet = res[1].data;
        return { ...wallet, transactions };
      })
      .catch((err) => err);
  }
  return Promise.reject("Error");
};

export const useGetWallet = (id?: number) =>
  useQuery<Wallet, Error>({
    queryFn: () => getWallet(id),
    queryKey: ["wallet", id],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    _optimisticResults: "optimistic",
    enabled: !!id,
  });
