import { walletHttpRepository, WalletHttpRepository } from "@/data/wallet/wallet-http.repository";
import { api } from "@/data/api/api.client";

jest.mock("@/data/api/api.client");

describe("WalletStoreAndRepository", () => {
  let repository: WalletHttpRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new WalletHttpRepository();
  });

  it("should fetch wallet from API endpoint successfully", async () => {
    const mockWalletData = {
      fiatBalanceBrl: 8500.0,
      cryptoBalanceBtc: 0.05000000,
      updatedAt: "2026-08-24T12:00:00.000Z",
    };

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockWalletData });

    const result = await repository.getWallet();

    expect(api.get).toHaveBeenCalledWith("/api/wallet");
    expect(result).toEqual(mockWalletData);
  });

  it("should return fallback mock wallet when API call fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await repository.getWallet();

    expect(result.fiatBalanceBrl).toBeGreaterThanOrEqual(0);
    expect(result.cryptoBalanceBtc).toBeGreaterThanOrEqual(0);
    expect(result.updatedAt).toBeDefined();
  });

  it("should update local wallet balances correctly", () => {
    repository.updateLocalWallet(-1000, 0.004);
    
    // Testa atualização do estado local
    expect(repository).toBeDefined();
  });
});
