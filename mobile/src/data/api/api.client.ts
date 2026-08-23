import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authHttpRepository } from "@/data/auth/auth-http.repository";
import { storage } from "@/data/storage/storage.service";

/**
 * Shared Axios client with attach-token + refresh-on-401 queue.
 * TRADE-OFF: keep this in data/; do not import navigation from here in POC
 * (pass an onUnauthorized callback from infrastructure instead).
 */

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let onUnauthorized: (() => void) | null = null;
let refreshing: Promise<string | null> | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const session = await storage.getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    refreshing ??= (async () => {
      const session = await storage.getSession();
      if (!session?.refreshToken) return null;
      try {
        const next = await authHttpRepository.refresh(session.refreshToken);
        await storage.setSession(next);
        return next.accessToken;
      } catch {
        await storage.clearSession();
        onUnauthorized?.();
        return null;
      } finally {
        refreshing = null;
      }
    })();

    const token = await refreshing;
    if (!token) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  },
);
