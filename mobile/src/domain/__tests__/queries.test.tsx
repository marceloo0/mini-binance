import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWalletQuery, WALLET_QUERY_KEY } from "@/domain/wallet/queries";
import { useBtcPriceQuery, MARKET_BTC_QUERY_KEY } from "@/domain/market/queries";
import { useTransactionsQuery, TRANSACTIONS_QUERY_KEY } from "@/domain/transactions/queries";
import { useExecuteTradeMutation } from "@/domain/trade/queries";
import { walletHttpRepository } from "@/data/wallet/wallet-http.repository";
import { marketHttpRepository } from "@/data/market/market-http.repository";
import { transactionsHttpRepository } from "@/data/transactions/transactions-http.repository";
import { tradeHttpRepository } from "@/data/trade/trade-http.repository";

jest.mock("@/data/wallet/wallet-http.repository");
jest.mock("@/data/market/market-http.repository");
jest.mock("@/data/transactions/transactions-http.repository");
jest.mock("@/data/trade/trade-http.repository");

describe("Domain TanStack Query Hooks", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, refetchInterval: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute useWalletQuery and return wallet data", async () => {
    const mockWallet = { fiatBalanceBrl: 10000, cryptoBalanceBtc: 0, updatedAt: "2026-08-24" };
    (walletHttpRepository.getWallet as jest.Mock).mockResolvedValueOnce(mockWallet);

    const { result } = await renderHook(() => useWalletQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWallet);
    expect(WALLET_QUERY_KEY).toEqual(["wallet"]);
  });

  it("should execute useBtcPriceQuery and return market price data", async () => {
    const mockMarket = { priceBrl: 250000, change24hPercentage: 1.5, timestamp: "2026-08-24" };
    (marketHttpRepository.getBtcPrice as jest.Mock).mockResolvedValueOnce(mockMarket);

    const { result } = await renderHook(() => useBtcPriceQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockMarket);
    expect(MARKET_BTC_QUERY_KEY).toEqual(["market", "btc"]);
  });

  it("should execute useTransactionsQuery and return transactions list", async () => {
    const mockTransactions = [{ id: "tx-1", type: "BUY" as const, fiatAmountBrl: 1000, cryptoAmountBtc: 0.004, executedPriceBrl: 250000, createdAt: "2026-08-24" }];
    (transactionsHttpRepository.getTransactions as jest.Mock).mockResolvedValueOnce(mockTransactions);

    const { result } = await renderHook(() => useTransactionsQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTransactions);
    expect(TRANSACTIONS_QUERY_KEY).toEqual(["transactions"]);
  });

  it("should execute useExecuteTradeMutation and invalidate wallet & transaction queries on success", async () => {
    const mockTradeResult = { transactionId: "tx-new", type: "BUY" as const, fiatAmountBrl: 1000, cryptoAmountBtc: 0.004, executedPriceBrl: 250000, createdAt: "2026-08-24" };
    (tradeHttpRepository.executeTrade as jest.Mock).mockResolvedValueOnce(mockTradeResult);

    const wrapper = createWrapper();
    const { result } = await renderHook(() => useExecuteTradeMutation(), { wrapper });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      result.current.mutate({ type: "BUY", amount: 1000, expectedPriceBrl: 250000 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WALLET_QUERY_KEY });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: TRANSACTIONS_QUERY_KEY });
  });
});
