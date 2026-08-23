import { create } from "zustand";
import { authHttpRepository } from "@/data/auth/auth-http.repository";
import type { AuthSession, LoginInput } from "@/domain/auth/models";
import { storage } from "@/data/storage/storage.service";

type UserProfile = {
  id: string;
  email: string;
};

type AuthState = {
  session: AuthSession | null;
  user: UserProfile | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  hydrated: false,

  async hydrate() {
    const session = await storage.getSession();
    if (session) {
      try {
        const user = await authHttpRepository.me(session.accessToken);
        set({ session, user, hydrated: true });
        return;
      } catch {
        await storage.clearSession();
      }
    }
    set({ session: null, user: null, hydrated: true });
  },

  async signIn(input) {
    const session = await authHttpRepository.login(input);
    await storage.setSession(session);
    const user = await authHttpRepository.me(session.accessToken);
    set({ session, user });
  },

  async signUp(email, password) {
    const session = await authHttpRepository.login({ email, password });
    await storage.setSession(session);
    const user = { id: session.userId, email };
    set({ session, user });
  },

  async signOut() {
    await storage.clearSession();
    set({ session: null, user: null });
  },
}));
