import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { DashboardScreen } from "../dashboard.screen";
import { useWalletQuery } from "@/domain/wallet/queries";
import { useBtcPriceQuery } from "@/domain/market/queries";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("@/domain/wallet/queries");
jest.mock("@/domain/market/queries");

describe("DashboardScreen Component", () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: { id: "1", email: "trader@binance.com" },
      signOut: mockSignOut,
    });

    (useWalletQuery as jest.Mock).mockReturnValue({
      data: { fiatBalanceBrl: 10000, cryptoBalanceBtc: 0.1, updatedAt: "2026-08-24" },
      isLoading: false,
    });

    (useBtcPriceQuery as jest.Mock).mockReturnValue({
      data: { priceBrl: 250000, change24hPercentage: 2.5, timestamp: "2026-08-24" },
      isLoading: false,
    });
  });

  it("should render user greeting, balances and ticker properly", async () => {
    await act(async () => {
      render(<DashboardScreen />);
    });

    expect(screen.getByText("Olá, Trader!")).toBeTruthy();
    expect(screen.getByText("trader@binance.com")).toBeTruthy();
    expect(screen.getByText("AÇÕES RÁPIDAS")).toBeTruthy();
    expect(screen.getByText("TRADE (COMPRA/VENDA)")).toBeTruthy();
    expect(screen.getByText("EXTRATO DE ORDENS")).toBeTruthy();
  });

  it("should navigate to trade screen when clicking trade action card", async () => {
    await act(async () => {
      render(<DashboardScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("TRADE (COMPRA/VENDA)"));
    });

    expect(router.push).toHaveBeenCalledWith("/(private)/trade");
  });

  it("should navigate to transactions screen when clicking extrato action card", async () => {
    await act(async () => {
      render(<DashboardScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("EXTRATO DE ORDENS"));
    });

    expect(router.push).toHaveBeenCalledWith("/(private)/transactions");
  });

  it("should sign out user and navigate to sign-in screen when clicking SAIR", async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    await act(async () => {
      render(<DashboardScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("SAIR"));
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/(auth)/sign-in");
  });
});
