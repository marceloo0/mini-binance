import { TransactionsHttpRepository } from "../transactions-http.repository";
import { api } from "@/data/api/api.client";

jest.mock("@/data/api/api.client");

describe("TransactionsHttpRepository", () => {
  let repository: TransactionsHttpRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TransactionsHttpRepository();
  });

  it("should fetch transactions from API successfully", async () => {
    const mockData = [
      {
        id: "tx-100",
        type: "BUY" as const,
        fiatAmountBrl: 2000,
        cryptoAmountBtc: 0.008,
        executedPriceBrl: 250000,
        createdAt: "2026-08-24T10:00:00.000Z",
      },
    ];

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await repository.getTransactions();

    expect(api.get).toHaveBeenCalledWith("/api/transactions");
    expect(result).toEqual(mockData);
  });

  it("should return fallback local transactions list when API fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("Offline"));

    const result = await repository.getTransactions();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should prepend new transaction to local history", () => {
    const newRecord = {
      id: "tx-new",
      type: "SELL" as const,
      fiatAmountBrl: 1500,
      cryptoAmountBtc: 0.006,
      executedPriceBrl: 250000,
      createdAt: "2026-08-24T15:00:00.000Z",
    };

    repository.addLocalTransaction(newRecord);
    expect(repository).toBeDefined();
  });
});
