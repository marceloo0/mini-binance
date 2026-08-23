import type { BtcMarketPrice } from "./models";

export interface MarketRepository {
  getBtcPrice(): Promise<BtcMarketPrice>;
}
