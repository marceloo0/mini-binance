export type TradeType = "BUY" | "SELL";

export interface TradeOrderInput {
  type: TradeType;
  amount: number; // Em BRL para compra, em BTC para venda
  expectedPriceBrl: number;
  idempotencyKey?: string;
}

export interface TradeResult {
  transactionId: string;
  type: TradeType;
  fiatAmountBrl: number;
  cryptoAmountBtc: number;
  executedPriceBrl: number;
  createdAt: string;
}
