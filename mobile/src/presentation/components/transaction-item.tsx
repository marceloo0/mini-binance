import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { TransactionRecord } from "@/domain/transactions/models";

interface TransactionItemProps {
  transaction: TransactionRecord;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isBuy = transaction.type === "BUY";
  const formattedDate = new Date(transaction.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatBrl = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={[styles.badge, isBuy ? styles.badgeBuy : styles.badgeSell]}>
          <Text style={[styles.badgeText, isBuy ? styles.textBuy : styles.textSell]}>
            {isBuy ? "COMPRA" : "VENDA"}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.pairText}>BTC / BRL</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={[styles.cryptoText, isBuy ? styles.textBuy : styles.textSell]}>
          {isBuy ? "+" : "-"}
          {transaction.cryptoAmountBtc.toFixed(8)} BTC
        </Text>

        <Text style={styles.fiatText}>
          {isBuy ? "-" : "+"}
          {formatBrl(transaction.fiatAmountBrl)}
        </Text>

        <Text style={styles.priceSubtext}>Preço: {formatBrl(transaction.executedPriceBrl)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E222D",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeBuy: {
    backgroundColor: "rgba(14, 203, 129, 0.15)",
  },
  badgeSell: {
    backgroundColor: "rgba(246, 70, 93, 0.15)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  textBuy: {
    color: "#0ECB81",
  },
  textSell: {
    color: "#F6465D",
  },
  details: {
    gap: 2,
  },
  pairText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    color: "#5E6673",
    fontSize: 11,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  cryptoText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fiatText: {
    color: "#848E9C",
    fontSize: 12,
  },
  priceSubtext: {
    color: "#5E6673",
    fontSize: 10,
  },
});
