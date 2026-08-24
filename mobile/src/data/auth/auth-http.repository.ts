import type { AuthRepository } from "@/domain/auth/ports";
import type { AuthSession, LoginInput } from "@/domain/auth/models";
import { api } from "@/data/api/api.client";

export class AuthHttpRepository implements AuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    try {
      const response = await api.post<{
        access_token?: string;
        token_type?: string;
        user_id?: number;
      }>("/api/login", {
        email: input.email,
        password: input.password,
      });

      if (response.data && typeof response.data.access_token === "string") {
        return {
          accessToken: response.data.access_token,
          refreshToken: "",
          userId: String(response.data.user_id),
        };
      }
      throw new Error("Resposta inválida do servidor.");
    } catch (error: any) {
      if (error?.response?.data?.errors?.email?.[0]) {
        throw new Error(error.response.data.errors.email[0]);
      }
      if (
        error?.response?.data?.message &&
        typeof error.response.data.message === "string" &&
        !error.response.data.message.includes("<!DOCTYPE")
      ) {
        throw new Error(error.response.data.message);
      }
      if (error?.response?.status === 401 || error?.response?.status === 422) {
        throw new Error("Credenciais inválidas. Verifique o e-mail e a senha.");
      }
      throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está ativo.");
    }
  }

  async register(input: { name?: string; email: string; password: string }): Promise<AuthSession> {
    try {
      const response = await api.post<{
        access_token?: string;
        token_type?: string;
        user_id?: number;
      }>("/api/register", {
        name: input.name ?? "Usuário",
        email: input.email,
        password: input.password,
      });

      if (response.data && typeof response.data.access_token === "string") {
        return {
          accessToken: response.data.access_token,
          refreshToken: "",
          userId: String(response.data.user_id),
        };
      }
      throw new Error("Resposta inválida do servidor.");
    } catch (error: any) {
      if (
        error?.response?.data?.message &&
        typeof error.response.data.message === "string" &&
        !error.response.data.message.includes("<!DOCTYPE")
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está ativo.");
    }
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    return {
      accessToken: "",
      refreshToken,
      userId: "",
    };
  }

  async me(accessToken: string): Promise<{ id: string; email: string }> {
    try {
      const response = await api.get<{ id?: number; name?: string; email?: string }>("/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data && typeof response.data.email === "string") {
        return {
          id: String(response.data.id ?? "user-1"),
          email: response.data.email,
        };
      }
      throw new Error("Dados do usuário não encontrados.");
    } catch (error: any) {
      throw new Error("Sessão expirada ou servidor inacessível.");
    }
  }
}

export const authHttpRepository = new AuthHttpRepository();
