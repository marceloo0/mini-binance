import type { AuthRepository } from "@/domain/auth/ports";
import type { AuthSession, LoginInput } from "@/domain/auth/models";

/** Mock auth adapter — swap for real endpoints in the interview if asked. */
export class AuthHttpRepository implements AuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    // TODO: POST /auth/login
    return {
      accessToken: "access-mock",
      refreshToken: "refresh-mock",
      userId: "user-1",
    };
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    // TODO: POST /auth/refresh
    return {
      accessToken: "access-mock-refreshed",
      refreshToken,
      userId: "user-1",
    };
  }

  async me(_accessToken: string) {
    return { id: "user-1", email: "demo@example.com" };
  }
}

export const authHttpRepository = new AuthHttpRepository();
