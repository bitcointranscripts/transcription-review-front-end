import axios from "../axios";

import { useQuery } from "@tanstack/react-query";

import endpoints from "../endpoints";
import { Wallet } from "../../../../types";

const getWallet = async (userId?: number): Promise<Wallet> => {
  const walletResponse = await axios.get(endpoints.GET_WALLET(userId));
  if (walletResponse.status !== 200) {
    throw new Error("Failed to fetch wallet");
  }
  return walletResponse.data as unknown as Wallet;
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
