import type { AuthRepository } from "@/domain/auth/ports";
import type { AuthSession, LoginInput } from "@/domain/auth/models";
import { api } from "@/data/api/api.client";

export class AuthHttpRepository implements AuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
        user_id: number;
      }>("/api/login", {
        email: input.email,
        password: input.password,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: "",
        userId: String(response.data.user_id),
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error?.response?.data?.errors?.email?.[0]) {
        throw new Error(error.response.data.errors.email[0]);
      }
      // Se não houver resposta do servidor (offline), lança erro amigável de credencial/conexão
      throw new Error("Credenciais inválidas ou erro de conexão com a API.");
    }
  }

  async register(input: { name?: string; email: string; password: string }): Promise<AuthSession> {
    try {
      const response = await api.post<{
        access_token: string;
        token_type: string;
        user_id: number;
      }>("/api/register", {
        name: input.name ?? "Usuário",
        email: input.email,
        password: input.password,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: "",
        userId: String(response.data.user_id),
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao realizar cadastro. Verifique os dados fornecidos.");
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
      const response = await api.get<{ id: number; name: string; email: string }>("/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        id: String(response.data.id),
        email: response.data.email,
      };
    } catch {
      return { id: "user-1", email: "usuario@minibinance.com" };
    }
  }
}

export const authHttpRepository = new AuthHttpRepository();
