import { useTradeStore } from "../trade.store";

describe("TradeStore", () => {
  beforeEach(() => {
    useTradeStore.setState({
      mode: "BUY",
      amountInput: "",
    });
  });

  it("should initialize with default mode BUY and empty amountInput", () => {
    const state = useTradeStore.getState();
    expect(state.mode).toBe("BUY");
    expect(state.amountInput).toBe("");
  });

  it("should update trade mode and reset amountInput", () => {
    useTradeStore.getState().setAmountInput("1500");
    expect(useTradeStore.getState().amountInput).toBe("1500");

    useTradeStore.getState().setMode("SELL");
    
    const state = useTradeStore.getState();
    expect(state.mode).toBe("SELL");
    expect(state.amountInput).toBe("");
  });

  it("should update amountInput value", () => {
    useTradeStore.getState().setAmountInput("250.75");
    expect(useTradeStore.getState().amountInput).toBe("250.75");
  });

  it("should reset form input", () => {
    useTradeStore.getState().setAmountInput("5000");
    useTradeStore.getState().resetForm();

    expect(useTradeStore.getState().amountInput).toBe("");
  });
});
