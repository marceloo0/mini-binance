import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { TransactionsScreen } from "../transactions.screen";
import { useTransactionsQuery } from "@/domain/transactions/queries";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@/domain/transactions/queries");

describe("TransactionsScreen Component", () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render screen header and back navigation button", async () => {
    (useTransactionsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
      isRefetching: false,
    });

    await act(async () => {
      render(<TransactionsScreen />);
    });

    expect(screen.getByText("Histórico de Ordens")).toBeTruthy();
    expect(screen.getByText("← Voltar")).toBeTruthy();
    expect(screen.getByText("Nenhuma transação realizada ainda.")).toBeTruthy();
  });

  it("should render transaction list items correctly", async () => {
    const mockList = [
      {
        id: "tx-1",
        type: "BUY" as const,
        fiatAmountBrl: 1000,
        cryptoAmountBtc: 0.004,
        executedPriceBrl: 250000,
        createdAt: "2026-08-24T12:00:00.000Z",
      },
    ];

    (useTransactionsQuery as jest.Mock).mockReturnValue({
      data: mockList,
      isLoading: false,
      refetch: mockRefetch,
      isRefetching: false,
    });

    await act(async () => {
      render(<TransactionsScreen />);
    });

    expect(screen.getByText("COMPRA")).toBeTruthy();
  });

  it("should navigate back when pressing back button", async () => {
    (useTransactionsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
      isRefetching: false,
    });

    await act(async () => {
      render(<TransactionsScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("← Voltar"));
    });

    expect(router.back).toHaveBeenCalled();
  });
});
