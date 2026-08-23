import { useQuery } from "@tanstack/react-query";
import { transactionsHttpRepository } from "@/data/transactions/transactions-http.repository";

export const TRANSACTIONS_QUERY_KEY = ["transactions"] as const;

export function useTransactionsQuery() {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: () => transactionsHttpRepository.getTransactions(),
    staleTime: 1000 * 10,
  });
}
