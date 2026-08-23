import type { TradeType } from "@/domain/trade/models";

export interface TransactionRecord {
  id: string;
  type: TradeType;
  fiatAmountBrl: number;
  cryptoAmountBtc: number;
  executedPriceBrl: number;
  createdAt: string;
}
