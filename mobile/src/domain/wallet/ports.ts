import type { UserWallet } from "./models";

export interface WalletRepository {
  getWallet(): Promise<UserWallet>;
}
