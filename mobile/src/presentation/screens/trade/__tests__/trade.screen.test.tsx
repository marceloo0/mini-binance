import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { TradeScreen } from "../trade.screen";
import { useWalletQuery } from "@/domain/wallet/queries";
import { useBtcPriceQuery } from "@/domain/market/queries";
import { useExecuteTradeMutation } from "@/domain/trade/queries";
import { useTradeStore } from "@/presentation/stores/trade.store";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@/domain/wallet/queries");
jest.mock("@/domain/market/queries");
jest.mock("@/domain/trade/queries");

describe("TradeScreen Component", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useTradeStore.setState({
      mode: "BUY",
      amountInput: "",
    });

    (useWalletQuery as jest.Mock).mockReturnValue({
      data: {
        fiatBalanceBrl: 10000.0,
        cryptoBalanceBtc: 0.0,
        updatedAt: "2026-08-24T12:00:00.000Z",
      },
    });

    (useBtcPriceQuery as jest.Mock).mockReturnValue({
      data: {
        priceBrl: 250000.0,
        change24hPercentage: 2.5,
        timestamp: "2026-08-24T12:00:00.000Z",
      },
    });

    (useExecuteTradeMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should render screen title and back navigation button", async () => {
    await act(async () => {
      render(<TradeScreen />);
    });

    expect(screen.getByText("Negoceie BTC")).toBeTruthy();
    expect(screen.getByText("← Voltar")).toBeTruthy();
  });

  it("should navigate back when pressing back button", async () => {
    await act(async () => {
      render(<TradeScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("← Voltar"));
    });

    expect(router.back).toHaveBeenCalled();
  });

  it("should trigger trade mutation upon submitting form", async () => {
    await act(async () => {
      render(<TradeScreen />);
    });

    const input = screen.getByPlaceholderText("Ex: 500,00");
    
    await act(async () => {
      fireEvent.changeText(input, "5000");
    });

    const buyButton = screen.getByText("CONFIRMAR COMPRA");

    await act(async () => {
      fireEvent.press(buyButton);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "BUY",
        amount: 5000,
        expectedPriceBrl: 250000.0,
      }),
      expect.any(Object)
    );
  });
});
