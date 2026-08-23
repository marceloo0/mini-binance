import type { AuthSession, LoginInput } from "./models";

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
  refresh(refreshToken: string): Promise<AuthSession>;
  me(accessToken: string): Promise<{ id: string; email: string }>;
}
