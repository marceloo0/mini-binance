import type { WalletRepository } from "@/domain/wallet/ports";
import type { UserWallet } from "@/domain/wallet/models";
import { api } from "@/data/api/api.client";

// Mock em memória para fallback/POC com dados iniciais exigidos pelo teste técnico
let mockWalletState: UserWallet = {
  fiatBalanceBrl: 10000.0,
  cryptoBalanceBtc: 0.0,
  updatedAt: new Date().toISOString(),
};

export class WalletHttpRepository implements WalletRepository {
  async getWallet(): Promise<UserWallet> {
    try {
      const response = await api.get<UserWallet>("/api/wallet");
      return response.data;
    } catch {
      return mockWalletState;
    }
  }

  updateLocalWallet(fiatChange: number, cryptoChange: number) {
    mockWalletState = {
      fiatBalanceBrl: Math.max(0, Number((mockWalletState.fiatBalanceBrl + fiatChange).toFixed(2))),
      cryptoBalanceBtc: Math.max(0, Number((mockWalletState.cryptoBalanceBtc + cryptoChange).toFixed(8))),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const walletHttpRepository = new WalletHttpRepository();
