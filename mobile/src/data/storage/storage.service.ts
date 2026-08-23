import type { AuthSession } from "@/domain/auth/models";

const SESSION_KEY = "@minibinance/session";

let memorySession: AuthSession | null = null;

/**
 * Storage Facade Sênior:
 * Tenta utilizar expo-secure-store quando disponível em dispositivo nativo (Keychain/Keystore).
 * Se executando em ambiente Web ou Teste, utiliza fallback gracioso em memória.
 */
export const storage = {
  async getSession(): Promise<AuthSession | null> {
    try {
      // Importação dinâmica para evitar erros em ambiente web puro sem a lib nativa instalada
      const SecureStore = await import("expo-secure-store");
      const json = await SecureStore.getItemAsync(SESSION_KEY);
      if (json) return JSON.parse(json);
    } catch {
      // Fallback em memória
    }
    return memorySession;
  },

  async setSession(session: AuthSession): Promise<void> {
    memorySession = session;
    try {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Fallback em memória
    }
  },

  async clearSession(): Promise<void> {
    memorySession = null;
    try {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch {
      // Fallback em memória
    }
  },
};
