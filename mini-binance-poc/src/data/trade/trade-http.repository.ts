import type { TradeRepository } from "@/domain/trade/ports";
import type { TradeOrderInput, TradeResult } from "@/domain/trade/models";
import { api } from "@/data/api/api.client";
import { walletHttpRepository } from "@/data/wallet/wallet-http.repository";
import { transactionsHttpRepository } from "@/data/transactions/transactions-http.repository";

export class TradeHttpRepository implements TradeRepository {
  async executeTrade(input: TradeOrderInput): Promise<TradeResult> {
    const endpoint = input.type === "BUY" ? "/api/trade/buy" : "/api/trade/sell";

    try {
      const response = await api.post<TradeResult>(
        endpoint,
        {
          amount: input.amount,
          expected_price: input.expectedPriceBrl,
        },
        {
          headers: input.idempotencyKey ? { "X-Idempotency-Key": input.idempotencyKey } : undefined,
        }
      );
      return response.data;
    } catch (error) {
      // Validação local e simulação para execução da POC quando backend offline
      const currentWallet = await walletHttpRepository.getWallet();

      if (input.type === "BUY") {
        const costBrl = input.amount; // Valor em BRL que o usuário quer gastar
        if (costBrl > currentWallet.fiatBalanceBrl) {
          throw new Error("Saldo insuficiente em BRL para realizar esta compra.");
        }

        const btcAcquired = Number((costBrl / input.expectedPriceBrl).toFixed(8));

        // Atualiza carteira e salva transação
        walletHttpRepository.updateLocalWallet(-costBrl, +btcAcquired);

        const result: TradeResult = {
          transactionId: `tx-${Date.now()}`,
          type: "BUY",
          fiatAmountBrl: costBrl,
          cryptoAmountBtc: btcAcquired,
          executedPriceBrl: input.expectedPriceBrl,
          createdAt: new Date().toISOString(),
        };

        transactionsHttpRepository.addLocalTransaction({
          id: result.transactionId,
          type: result.type,
          fiatAmountBrl: result.fiatAmountBrl,
          cryptoAmountBtc: result.cryptoAmountBtc,
          executedPriceBrl: result.executedPriceBrl,
          createdAt: result.createdAt,
        });

        return result;
      } else {
        const btcToSell = input.amount; // Quantidade de BTC a vender
        if (btcToSell > currentWallet.cryptoBalanceBtc) {
          throw new Error("Saldo insuficiente em BTC para realizar esta venda.");
        }

        const fiatEarned = Number((btcToSell * input.expectedPriceBrl).toFixed(2));

        walletHttpRepository.updateLocalWallet(+fiatEarned, -btcToSell);

        const result: TradeResult = {
          transactionId: `tx-${Date.now()}`,
          type: "SELL",
          fiatAmountBrl: fiatEarned,
          cryptoAmountBtc: btcToSell,
          executedPriceBrl: input.expectedPriceBrl,
          createdAt: new Date().toISOString(),
        };

        transactionsHttpRepository.addLocalTransaction({
          id: result.transactionId,
          type: result.type,
          fiatAmountBrl: result.fiatAmountBrl,
          cryptoAmountBtc: result.cryptoAmountBtc,
          executedPriceBrl: result.executedPriceBrl,
          createdAt: result.createdAt,
        });

        return result;
      }
    }
  }
}

export const tradeHttpRepository = new TradeHttpRepository();
