import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native";
import { SignInScreen } from "../sign-in.screen";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

describe("SignInScreen Component", () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      signIn: mockSignIn,
      session: null,
      user: null,
      hydrated: true,
    });
  });

  it("should render sign-in form elements properly", async () => {
    await act(async () => {
      render(<SignInScreen />);
    });

    expect(screen.getByText("MINI BINANCE")).toBeTruthy();
    expect(screen.getByText("Acesse sua conta de trading")).toBeTruthy();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("******")).toBeTruthy();
    expect(screen.getByText("ENTRAR")).toBeTruthy();
  });

  it("should display error message when trying to submit empty fields", async () => {
    await act(async () => {
      render(<SignInScreen />);
    });

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("******");

    await act(async () => {
      fireEvent.changeText(emailInput, "");
      fireEvent.changeText(passwordInput, "");
    });

    await act(async () => {
      fireEvent.press(screen.getByText("ENTRAR"));
    });

    expect(screen.getByText("Preencha e-mail e senha.")).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("should call signIn store function and navigate to dashboard on success", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);

    await act(async () => {
      render(<SignInScreen />);
    });

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("******");

    await act(async () => {
      fireEvent.changeText(emailInput, "trader@binance.com");
      fireEvent.changeText(passwordInput, "secret123");
    });

    await act(async () => {
      fireEvent.press(screen.getByText("ENTRAR"));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "trader@binance.com",
        password: "secret123",
      });
      expect(router.replace).toHaveBeenCalledWith("/(private)/dashboard");
    });
  });

  it("should show error feedback message when signIn fails", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Credenciais inválidas."));

    await act(async () => {
      render(<SignInScreen />);
    });

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText("seu@email.com"), "wrong@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("******"), "wrongpass");
    });

    await act(async () => {
      fireEvent.press(screen.getByText("ENTRAR"));
    });

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas.")).toBeTruthy();
    });
  });
});
