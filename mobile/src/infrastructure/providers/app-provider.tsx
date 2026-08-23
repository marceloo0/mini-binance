import { useEffect, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/data/api/api.client";
import { queryClient } from "@/infrastructure/config/react-query.config";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

type Props = { children: ReactNode };

/**
 * Composition Root — conecta infraestrutura, estado global e provedores.
 */
export function AppProvider({ children }: Props) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    void hydrate();
    setUnauthorizedHandler(() => {
      void signOut();
      router.replace("/(auth)/sign-in");
    });
  }, [hydrate, signOut]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
