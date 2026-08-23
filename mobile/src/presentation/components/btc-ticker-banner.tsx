import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BtcMarketPrice } from "@/domain/market/models";

interface BtcTickerBannerProps {
  marketPrice: BtcMarketPrice | undefined;
  isLoading?: boolean;
}

export function BtcTickerBanner({ marketPrice, isLoading }: BtcTickerBannerProps) {
  const isPositive = (marketPrice?.change24hPercentage ?? 0) >= 0;
  const formatBrl = (val?: number) =>
    (val ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.headerRow}>
        <View style={styles.pairContainer}>
          <Text style={styles.pairText}>BTC / BRL</Text>
          <Text style={styles.liveIndicator}>● LIVE</Text>
        </View>
        <View style={[styles.badge, isPositive ? styles.badgeGreen : styles.badgeRed]}>
          <Text style={[styles.badgeText, isPositive ? styles.textGreen : styles.textRed]}>
            {isPositive ? "+" : ""}
            {marketPrice?.change24hPercentage ?? 0}%
          </Text>
        </View>
      </View>

      <Text style={styles.priceText}>
        {isLoading ? "R$ --.--" : formatBrl(marketPrice?.priceBrl)}
      </Text>
      <Text style={styles.subtext}>Faixa dinâmica simulada (200k - 300k BRL)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#161A25",
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F0B90B",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  pairContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pairText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  liveIndicator: {
    color: "#0ECB81",
    fontSize: 10,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGreen: {
    backgroundColor: "rgba(14, 203, 129, 0.15)",
  },
  badgeRed: {
    backgroundColor: "rgba(246, 70, 93, 0.15)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  textGreen: {
    color: "#0ECB81",
  },
  textRed: {
    color: "#F6465D",
  },
  priceText: {
    color: "#F0B90B",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  subtext: {
    color: "#5E6673",
    fontSize: 11,
    marginTop: 6,
  },
});
