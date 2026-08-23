import { create } from "zustand";
import type { TradeType } from "@/domain/trade/models";

type TradeUIState = {
  mode: TradeType;
  amountInput: string;
  setMode: (mode: TradeType) => void;
  setAmountInput: (val: string) => void;
  resetForm: () => void;
};

export const useTradeStore = create<TradeUIState>((set) => ({
  mode: "BUY",
  amountInput: "",
  setMode: (mode) => set({ mode, amountInput: "" }),
  setAmountInput: (amountInput) => set({ amountInput }),
  resetForm: () => set({ amountInput: "" }),
}));
