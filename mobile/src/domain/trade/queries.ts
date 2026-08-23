import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tradeHttpRepository } from "@/data/trade/trade-http.repository";
import type { TradeOrderInput } from "./models";
import { WALLET_QUERY_KEY } from "@/domain/wallet/queries";
import { TRANSACTIONS_QUERY_KEY } from "@/domain/transactions/queries";

export function useExecuteTradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TradeOrderInput) => tradeHttpRepository.executeTrade(input),
    onSuccess: () => {
      // Invalidação reativa imediata do saldo e extrato
      void queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}
