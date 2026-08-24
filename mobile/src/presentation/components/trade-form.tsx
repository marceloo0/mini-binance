import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useTradeStore } from "@/presentation/stores/trade.store";
import type { BtcMarketPrice } from "@/domain/market/models";
import type { UserWallet } from "@/domain/wallet/models";

interface TradeFormProps {
  marketPrice: BtcMarketPrice | undefined;
  wallet: UserWallet | undefined;
  onSubmitTrade: (input: { amount: number; type: "BUY" | "SELL" }) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function TradeForm({
  marketPrice,
  wallet,
  onSubmitTrade,
  isSubmitting,
  errorMessage,
}: TradeFormProps) {
  const { mode, amountInput, setMode, setAmountInput } = useTradeStore();

  const numInput = parseFloat(amountInput.replace(",", ".")) || 0;
  const currentPrice = marketPrice?.priceBrl ?? 250000;

  // Cálculo da conversão em tempo real
  const conversionPreview =
    mode === "BUY"
      ? `${(numInput / currentPrice).toFixed(8)} BTC`
      : (numInput * currentPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const maxAvailable =
    mode === "BUY"
      ? (wallet?.fiatBalanceBrl ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : `${(wallet?.cryptoBalanceBtc ?? 0).toFixed(8)} BTC`;

  const handleMaxPress = () => {
    if (mode === "BUY") {
      setAmountInput((wallet?.fiatBalanceBrl ?? 0).toString());
    } else {
      setAmountInput((wallet?.cryptoBalanceBtc ?? 0).toString());
    }
  };

  const handleSubmit = () => {
    if (numInput <= 0 || isSubmitting) return;
    onSubmitTrade({ amount: numInput, type: mode });
  };

  return (
    <View style={styles.container}>
      {/* Selector BUY / SELL */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "BUY" && styles.toggleBtnBuy]}
          onPress={() => setMode("BUY")}
          disabled={isSubmitting}
        >
          <Text style={[styles.toggleText, mode === "BUY" && styles.toggleTextActive]}>
            COMPRAR BTC
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, mode === "SELL" && styles.toggleBtnSell]}
          onPress={() => setMode("SELL")}
          disabled={isSubmitting}
        >
          <Text style={[styles.toggleText, mode === "SELL" && styles.toggleTextActive]}>
            VENDER BTC
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input de Valor */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            {mode === "BUY" ? "Valor a investir (BRL)" : "Quantidade a vender (BTC)"}
          </Text>
          <TouchableOpacity testID="maxAmountButton" onPress={handleMaxPress}>
            <Text style={styles.maxBtn}>MAX ({maxAvailable})</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          testID="tradeAmountInput"
          style={styles.input}
          keyboardType="numeric"
          placeholder={mode === "BUY" ? "Ex: 500,00" : "Ex: 0.002"}
          placeholderTextColor="#5E6673"
          value={amountInput}
          onChangeText={setAmountInput}
          editable={!isSubmitting}
        />
      </View>

      {/* Preview de Conversão */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewLabel}>Estimativa de recebimento:</Text>
        <Text style={styles.previewValue}>{conversionPreview}</Text>
      </View>

      {/* Mensagem de Erro de Saldo ou API */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Botão de Envio com Proteção Contra Duplo Clique */}
      <TouchableOpacity
        testID="confirmTradeButton"
        style={[
          styles.submitBtn,
          mode === "BUY" ? styles.submitBtnBuy : styles.submitBtnSell,
          (numInput <= 0 || isSubmitting) && styles.disabledBtn,
        ]}
        onPress={handleSubmit}
        disabled={numInput <= 0 || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>
            CONFIRMAR {mode === "BUY" ? "COMPRA" : "VENDA"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E222D",
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#161A25",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleBtnBuy: {
    backgroundColor: "#0ECB81",
  },
  toggleBtnSell: {
    backgroundColor: "#F6465D",
  },
  toggleText: {
    color: "#848E9C",
    fontWeight: "bold",
    fontSize: 13,
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#848E9C",
    fontSize: 12,
    fontWeight: "600",
  },
  maxBtn: {
    color: "#F0B90B",
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#161A25",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  previewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2B313A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  previewLabel: {
    color: "#848E9C",
    fontSize: 12,
  },
  previewValue: {
    color: "#F0B90B",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "#F6465D",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitBtnBuy: {
    backgroundColor: "#0ECB81",
  },
  submitBtnSell: {
    backgroundColor: "#F6465D",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
