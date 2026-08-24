import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native";
import { SignUpScreen } from "../sign-up.screen";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

describe("SignUpScreen Component", () => {
  const mockSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      signUp: mockSignUp,
      session: null,
      user: null,
      hydrated: true,
    });
  });

  it("should render sign-up form elements properly", async () => {
    await act(async () => {
      render(<SignUpScreen />);
    });

    expect(screen.getByText("CRIAR CONTA")).toBeTruthy();
    expect(screen.getByText("Registre-se para iniciar no Mini Binance")).toBeTruthy();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("Mínimo 6 caracteres")).toBeTruthy();
    expect(screen.getByText("CADASTRAR")).toBeTruthy();
  });

  it("should display error message when submitting empty fields", async () => {
    await act(async () => {
      render(<SignUpScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("CADASTRAR"));
    });

    expect(screen.getByText("Preencha e-mail e senha.")).toBeTruthy();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("should call signUp store function and navigate to dashboard on success", async () => {
    mockSignUp.mockResolvedValueOnce(undefined);

    await act(async () => {
      render(<SignUpScreen />);
    });

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText("seu@email.com"), "newuser@binance.com");
      fireEvent.changeText(screen.getByPlaceholderText("Mínimo 6 caracteres"), "password123");
    });

    await act(async () => {
      fireEvent.press(screen.getByText("CADASTRAR"));
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("newuser@binance.com", "password123");
      expect(router.replace).toHaveBeenCalledWith("/(private)/dashboard");
    });
  });

  it("should display error message when signUp fails", async () => {
    mockSignUp.mockRejectedValueOnce(new Error("Falha no cadastro"));

    await act(async () => {
      render(<SignUpScreen />);
    });

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText("seu@email.com"), "fail@binance.com");
      fireEvent.changeText(screen.getByPlaceholderText("Mínimo 6 caracteres"), "password123");
    });

    await act(async () => {
      fireEvent.press(screen.getByText("CADASTRAR"));
    });

    await waitFor(() => {
      expect(screen.getByText("Falha ao registrar usuário.")).toBeTruthy();
    });
  });

  it("should navigate back when pressing login link", async () => {
    await act(async () => {
      render(<SignUpScreen />);
    });

    await act(async () => {
      fireEvent.press(screen.getByText("Fazer Login"));
    });

    expect(router.back).toHaveBeenCalled();
  });
});
