import { TradeHttpRepository } from "../trade-http.repository";
import { api } from "@/data/api/api.client";
import { walletHttpRepository } from "@/data/wallet/wallet-http.repository";

jest.mock("@/data/api/api.client");
jest.mock("@/data/wallet/wallet-http.repository");
jest.mock("@/data/transactions/transactions-http.repository");

describe("TradeHttpRepository", () => {
  let repository: TradeHttpRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TradeHttpRepository();
  });

  it("should execute BUY trade via API successfully", async () => {
    const mockResult = {
      transactionId: "tx-1",
      type: "BUY" as const,
      fiatAmountBrl: 1000,
      cryptoAmountBtc: 0.004,
      executedPriceBrl: 250000,
      createdAt: "2026-08-24T12:00:00.000Z",
    };

    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResult });

    const result = await repository.executeTrade({
      type: "BUY",
      amount: 1000,
      expectedPriceBrl: 250000,
      idempotencyKey: "key-123",
    });

    expect(api.post).toHaveBeenCalledWith(
      "/api/trade/buy",
      { amount: 1000, expected_price: 250000 },
      { headers: { "X-Idempotency-Key": "key-123" } }
    );
    expect(result).toEqual(mockResult);
  });

  it("should execute SELL trade via API successfully", async () => {
    const mockResult = {
      transactionId: "tx-2",
      type: "SELL" as const,
      fiatAmountBrl: 2500,
      cryptoAmountBtc: 0.01,
      executedPriceBrl: 250000,
      createdAt: "2026-08-24T12:00:00.000Z",
    };

    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResult });

    const result = await repository.executeTrade({
      type: "SELL",
      amount: 0.01,
      expectedPriceBrl: 250000,
    });

    expect(api.post).toHaveBeenCalledWith(
      "/api/trade/sell",
      { amount: 0.01, expected_price: 250000 },
      { headers: undefined }
    );
    expect(result).toEqual(mockResult);
  });

  it("should execute offline BUY fallback when API fails and funds are sufficient", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    (walletHttpRepository.getWallet as jest.Mock).mockResolvedValueOnce({
      fiatBalanceBrl: 5000,
      cryptoBalanceBtc: 0,
      updatedAt: "2026-08-24",
    });

    const result = await repository.executeTrade({
      type: "BUY",
      amount: 1000,
      expectedPriceBrl: 250000,
    });

    expect(result.type).toBe("BUY");
    expect(result.fiatAmountBrl).toBe(1000);
    expect(walletHttpRepository.updateLocalWallet).toHaveBeenCalledWith(-1000, 0.004);
  });

  it("should throw error in offline BUY fallback when BRL balance is insufficient", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    (walletHttpRepository.getWallet as jest.Mock).mockResolvedValueOnce({
      fiatBalanceBrl: 100,
      cryptoBalanceBtc: 0,
      updatedAt: "2026-08-24",
    });

    await expect(
      repository.executeTrade({
        type: "BUY",
        amount: 1000,
        expectedPriceBrl: 250000,
      })
    ).rejects.toThrow("Saldo insuficiente em BRL para realizar esta compra.");
  });

  it("should execute offline SELL fallback when API fails and crypto balance is sufficient", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    (walletHttpRepository.getWallet as jest.Mock).mockResolvedValueOnce({
      fiatBalanceBrl: 0,
      cryptoBalanceBtc: 0.1,
      updatedAt: "2026-08-24",
    });

    const result = await repository.executeTrade({
      type: "SELL",
      amount: 0.05,
      expectedPriceBrl: 200000,
    });

    expect(result.type).toBe("SELL");
    expect(result.fiatAmountBrl).toBe(10000);
    expect(walletHttpRepository.updateLocalWallet).toHaveBeenCalledWith(10000, -0.05);
  });

  it("should throw error in offline SELL fallback when BTC balance is insufficient", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    (walletHttpRepository.getWallet as jest.Mock).mockResolvedValueOnce({
      fiatBalanceBrl: 0,
      cryptoBalanceBtc: 0.001,
      updatedAt: "2026-08-24",
    });

    await expect(
      repository.executeTrade({
        type: "SELL",
        amount: 0.05,
        expectedPriceBrl: 200000,
      })
    ).rejects.toThrow("Saldo insuficiente em BTC para realizar esta venda.");
  });
});
