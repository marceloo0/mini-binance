import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { TradeForm } from "../trade-form";
import { useTradeStore } from "@/presentation/stores/trade.store";

describe("TradeForm Component", () => {
  const mockOnSubmitTrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTradeStore.setState({
      mode: "BUY",
      amountInput: "",
    });
  });

  it("should render buy mode form fields correctly", async () => {
    await act(async () => {
      render(
        <TradeForm
          marketPrice={{ priceBrl: 250000, change24hPercentage: 2, timestamp: "2026-08-24" }}
          wallet={{ fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.5, updatedAt: "2026-08-24" }}
          onSubmitTrade={mockOnSubmitTrade}
          isSubmitting={false}
        />
      );
    });

    expect(screen.getByText("Valor a investir (BRL)")).toBeTruthy();
    expect(screen.getByText("CONFIRMAR COMPRA")).toBeTruthy();
  });

  it("should switch to sell mode when VENDER BTC tab is pressed", async () => {
    await act(async () => {
      render(
        <TradeForm
          marketPrice={{ priceBrl: 250000, change24hPercentage: 2, timestamp: "2026-08-24" }}
          wallet={{ fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.5, updatedAt: "2026-08-24" }}
          onSubmitTrade={mockOnSubmitTrade}
          isSubmitting={false}
        />
      );
    });

    await act(async () => {
      fireEvent.press(screen.getByText("VENDER BTC"));
    });

    expect(useTradeStore.getState().mode).toBe("SELL");
  });

  it("should set max available balance into input when MAX button is pressed in BUY mode", async () => {
    await act(async () => {
      render(
        <TradeForm
          marketPrice={{ priceBrl: 250000, change24hPercentage: 2, timestamp: "2026-08-24" }}
          wallet={{ fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.5, updatedAt: "2026-08-24" }}
          onSubmitTrade={mockOnSubmitTrade}
          isSubmitting={false}
        />
      );
    });

    await act(async () => {
      fireEvent.press(screen.getByText("MAX (R$ 10.000,00)"));
    });

    expect(useTradeStore.getState().amountInput).toBe("10000");
  });

  it("should set max available crypto balance in input when MAX button is pressed in SELL mode", async () => {
    useTradeStore.setState({ mode: "SELL", amountInput: "" });

    await act(async () => {
      render(
        <TradeForm
          marketPrice={{ priceBrl: 250000, change24hPercentage: 2, timestamp: "2026-08-24" }}
          wallet={{ fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.5, updatedAt: "2026-08-24" }}
          onSubmitTrade={mockOnSubmitTrade}
          isSubmitting={false}
        />
      );
    });

    await act(async () => {
      fireEvent.press(screen.getByText("MAX (0.50000000 BTC)"));
    });

    expect(useTradeStore.getState().amountInput).toBe("0.5");
  });

  it("should display error message when provided as prop", async () => {
    await act(async () => {
      render(
        <TradeForm
          marketPrice={{ priceBrl: 250000, change24hPercentage: 2, timestamp: "2026-08-24" }}
          wallet={{ fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.5, updatedAt: "2026-08-24" }}
          onSubmitTrade={mockOnSubmitTrade}
          isSubmitting={false}
          errorMessage="Saldo Insuficiente"
        />
      );
    });

    expect(screen.getByText("Saldo Insuficiente")).toBeTruthy();
  });
});
