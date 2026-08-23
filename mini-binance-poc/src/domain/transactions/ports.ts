import type { TransactionRecord } from "./models";

export interface TransactionsRepository {
  getTransactions(): Promise<TransactionRecord[]>;
}
