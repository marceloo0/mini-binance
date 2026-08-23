import type { TradeOrderInput, TradeResult } from "./models";

export interface TradeRepository {
  executeTrade(input: TradeOrderInput): Promise<TradeResult>;
}
