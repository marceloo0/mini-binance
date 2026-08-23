import type { TransactionsRepository } from "@/domain/transactions/ports";
import type { TransactionRecord } from "@/domain/transactions/models";
import { api } from "@/data/api/api.client";

let mockTransactions: TransactionRecord[] = [
  {
    id: "tx-init-1",
    type: "BUY",
    fiatAmountBrl: 1000.0,
    cryptoAmountBtc: 0.004,
    executedPriceBrl: 250000.0,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export class TransactionsHttpRepository implements TransactionsRepository {
  async getTransactions(): Promise<TransactionRecord[]> {
    try {
      const response = await api.get<TransactionRecord[]>("/api/transactions");
      return response.data;
    } catch {
      // Fallback ordenado por data decrescente (mais recente primeiro)
      return [...mockTransactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }

  addLocalTransaction(record: TransactionRecord) {
    mockTransactions.unshift(record);
  }
}

export const transactionsHttpRepository = new TransactionsHttpRepository();
