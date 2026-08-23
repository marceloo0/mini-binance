import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useWalletQuery } from "@/domain/wallet/queries";
import { useBtcPriceQuery } from "@/domain/market/queries";
import { BalanceCard } from "@/presentation/components/balance-card";
import { BtcTickerBanner } from "@/presentation/components/btc-ticker-banner";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

export function DashboardScreen() {
  const { data: wallet, isLoading: isWalletLoading } = useWalletQuery();
  const { data: marketPrice, isLoading: isMarketLoading } = useBtcPriceQuery();

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Trader!</Text>
          <Text style={styles.userEmail}>{user?.email ?? "demo@example.com"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <BalanceCard wallet={wallet} isLoading={isWalletLoading} />

      {/* Live Market Banner */}
      <BtcTickerBanner marketPrice={marketPrice} isLoading={isMarketLoading} />

      {/* Quick Action Navigation Buttons */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.buyAction]}
            onPress={() => router.push("/(private)/trade")}
          >
            <Text style={styles.actionTitle}>TRADE (COMPRA/VENDA)</Text>
            <Text style={styles.actionDesc}>Negociar BTC instantaneamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(private)/transactions")}
          >
            <Text style={styles.actionTitle}>EXTRATO DE ORDENS</Text>
            <Text style={styles.actionDesc}>Histórico de transações executadas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161A25",
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    color: "#F0B90B",
    fontSize: 22,
    fontWeight: "800",
  },
  userEmail: {
    color: "#848E9C",
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#2B313A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#F6465D",
    fontSize: 11,
    fontWeight: "bold",
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#848E9C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#1E222D",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  buyAction: {
    borderColor: "rgba(240, 185, 11, 0.4)",
  },
  actionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  actionDesc: {
    color: "#848E9C",
    fontSize: 12,
    marginTop: 4,
  },
});
