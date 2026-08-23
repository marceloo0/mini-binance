import { useQuery } from "@tanstack/react-query";
import { marketHttpRepository } from "@/data/market/market-http.repository";

export const MARKET_BTC_QUERY_KEY = ["market", "btc"] as const;

export function useBtcPriceQuery() {
  return useQuery({
    queryKey: MARKET_BTC_QUERY_KEY,
    queryFn: () => marketHttpRepository.getBtcPrice(),
    refetchInterval: 4000, // Polling a cada 4 segundos
    placeholderData: (previousData) => previousData,
  });
}
