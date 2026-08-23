import type { MarketRepository } from "@/domain/market/ports";
import type { BtcMarketPrice } from "@/domain/market/models";
import { api } from "@/data/api/api.client";

let currentPrice = 248500.0;
let lastChange = +1.42;

export class MarketHttpRepository implements MarketRepository {
  async getBtcPrice(): Promise<BtcMarketPrice> {
    try {
      const response = await api.get<BtcMarketPrice>("/api/market/btc");
      return response.data;
    } catch {
      // Simulação dinâmica dentro da faixa de 200k a 300k conforme especificado no PDF
      const delta = (Math.random() - 0.48) * 800; // Flutuação suave
      currentPrice = Math.min(300000, Math.max(200000, Math.round((currentPrice + delta) * 100) / 100));
      lastChange = Math.round((lastChange + (Math.random() - 0.5) * 0.1) * 100) / 100;

      return {
        priceBrl: currentPrice,
        change24hPercentage: lastChange,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const marketHttpRepository = new MarketHttpRepository();
