import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { UserWallet } from "@/domain/wallet/models";

interface BalanceCardProps {
  wallet: UserWallet | undefined;
  isLoading?: boolean;
}

export function BalanceCard({ wallet, isLoading }: BalanceCardProps) {
  const formatBrl = (val?: number) =>
    (val ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Sua Carteira</Text>

      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.balanceLabel}>Saldo Fiat (BRL)</Text>
          <Text style={styles.fiatBalance}>
            {isLoading ? "Carregando..." : formatBrl(wallet?.fiatBalanceBrl)}
          </Text>
        </View>

        <View style={styles.cryptoBadge}>
          <Text style={styles.cryptoLabel}>Saldo BTC</Text>
          <Text style={styles.cryptoBalance}>
            {isLoading ? "..." : `${(wallet?.cryptoBalanceBtc ?? 0).toFixed(8)} BTC`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E222D",
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#2A2E39",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    color: "#848E9C",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#848E9C",
    fontSize: 12,
  },
  fiatBalance: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  cryptoBadge: {
    backgroundColor: "#2B313A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "flex-end",
  },
  cryptoLabel: {
    color: "#F0B90B",
    fontSize: 11,
    fontWeight: "600",
  },
  cryptoBalance: {
    color: "#F0B90B",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },
});
