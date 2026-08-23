import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useWalletQuery } from "@/domain/wallet/queries";
import { useBtcPriceQuery } from "@/domain/market/queries";
import { useExecuteTradeMutation } from "@/domain/trade/queries";
import { TradeForm } from "@/presentation/components/trade-form";
import { BalanceCard } from "@/presentation/components/balance-card";
import { useTradeStore } from "@/presentation/stores/trade.store";
import { router } from "expo-router";

export function TradeScreen() {
  const { data: wallet } = useWalletQuery();
  const { data: marketPrice } = useBtcPriceQuery();
  const { resetForm } = useTradeStore();

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const tradeMutation = useExecuteTradeMutation();

  const handleTradeSubmit = ({ amount, type }: { amount: number; type: "BUY" | "SELL" }) => {
    setFeedback(null);

    const currentPrice = marketPrice?.priceBrl ?? 250000;
    const idempotencyKey = `idempotency-${Date.now()}-${Math.random()}`;

    tradeMutation.mutate(
      {
        type,
        amount,
        expectedPriceBrl: currentPrice,
        idempotencyKey,
      },
      {
        onSuccess: (data) => {
          resetForm();
          const actionText = type === "BUY" ? "Compra" : "Venda";
          setFeedback({
            type: "success",
            text: `${actionText} realizada com sucesso! ID: ${data.transactionId}`,
          });
        },
        onError: (err: any) => {
          setFeedback({
            type: "error",
            text: err?.message ?? "Falha ao processar ordem de trade.",
          });
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Negoceie BTC</Text>
      </View>

      <BalanceCard wallet={wallet} />

      {feedback ? (
        <View
          style={[
            styles.feedbackBox,
            feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              feedback.type === "success" ? styles.textSuccess : styles.textError,
            ]}
          >
            {feedback.text}
          </Text>
        </View>
      ) : null}

      <TradeForm
        marketPrice={marketPrice}
        wallet={wallet}
        onSubmitTrade={handleTradeSubmit}
        isSubmitting={tradeMutation.isPending}
      />
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
    paddingTop: 50,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: {
    paddingRight: 16,
  },
  backText: {
    color: "#F0B90B",
    fontSize: 14,
    fontWeight: "bold",
  },
  screenTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  feedbackBox: {
    borderRadius: 10,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: "rgba(14, 203, 129, 0.15)",
    borderColor: "#0ECB81",
  },
  feedbackError: {
    backgroundColor: "rgba(246, 70, 93, 0.15)",
    borderColor: "#F6465D",
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  textSuccess: {
    color: "#0ECB81",
  },
  textError: {
    color: "#F6465D",
  },
});
