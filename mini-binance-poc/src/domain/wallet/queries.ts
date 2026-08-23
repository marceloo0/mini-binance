import { useQuery } from "@tanstack/react-query";
import { walletHttpRepository } from "@/data/wallet/wallet-http.repository";

export const WALLET_QUERY_KEY = ["wallet"] as const;

export function useWalletQuery() {
  return useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: () => walletHttpRepository.getWallet(),
    staleTime: 1000 * 5, // 5 segundos de cache
  });
}
