import { AuthHttpRepository } from "../auth-http.repository";
import { api } from "@/data/api/api.client";

jest.mock("@/data/api/api.client");

describe("AuthHttpRepository", () => {
  let repository: AuthHttpRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AuthHttpRepository();
  });

  it("should login successfully and format response into AuthSession", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        access_token: "mock-token",
        token_type: "Bearer",
        user_id: 42,
      },
    });

    const session = await repository.login({ email: "test@example.com", password: "password123" });

    expect(api.post).toHaveBeenCalledWith("/api/login", {
      email: "test@example.com",
      password: "password123",
    });
    expect(session).toEqual({
      accessToken: "mock-token",
      refreshToken: "",
      userId: "42",
    });
  });

  it("should throw error message from API response on login failure", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Credenciais incorretas." } },
    });

    await expect(repository.login({ email: "wrong@example.com", password: "wrong" }))
      .rejects.toThrow("Credenciais incorretas.");
  });

  it("should throw email error when provided in login error response", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { errors: { email: ["E-mail inválido"] } } },
    });

    await expect(repository.login({ email: "invalid", password: "pass" }))
      .rejects.toThrow("E-mail inválido");
  });

  it("should throw default connection error when login API error has no specific message", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(repository.login({ email: "test@example.com", password: "pass" }))
      .rejects.toThrow("Credenciais inválidas ou erro de conexão com a API.");
  });

  it("should register successfully and return session", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: "new-token", token_type: "Bearer", user_id: 99 },
    });

    const session = await repository.register({ name: "Alice", email: "alice@example.com", password: "secret" });

    expect(api.post).toHaveBeenCalledWith("/api/register", {
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
    });
    expect(session.userId).toBe("99");
  });

  it("should register with default name 'Usuário' if name is omitted", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: "new-token", token_type: "Bearer", user_id: 100 },
    });

    await repository.register({ email: "noname@example.com", password: "secret" });

    expect(api.post).toHaveBeenCalledWith("/api/register", {
      name: "Usuário",
      email: "noname@example.com",
      password: "secret",
    });
  });

  it("should handle register error response gracefully", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(repository.register({ email: "fail@example.com", password: "secret" }))
      .rejects.toThrow("Erro ao realizar cadastro. Verifique os dados fornecidos.");
  });

  it("should refresh token returning formatted session", async () => {
    const session = await repository.refresh("some-refresh-token");
    expect(session.refreshToken).toBe("some-refresh-token");
  });

  it("should fetch me profile successfully", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { id: 10, name: "User 10", email: "user10@example.com" },
    });

    const user = await repository.me("valid-token");

    expect(api.get).toHaveBeenCalledWith("/api/me", {
      headers: { Authorization: "Bearer valid-token" },
    });
    expect(user).toEqual({ id: "10", email: "user10@example.com" });
  });

  it("should return fallback user profile when me request fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("Unauthorized"));

    const user = await repository.me("invalid-token");

    expect(user).toEqual({ id: "user-1", email: "usuario@minibinance.com" });
  });
});
