import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { router } from "expo-router";

export function SignInScreen() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((s) => s.signIn);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn({ email, password });
      router.replace("/(private)/dashboard");
    } catch (err: any) {
      setError(err?.message || "Falha ao efetuar login. Verifique as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brandTitle}>MINI BINANCE</Text>
        <Text style={styles.subtitle}>Acesse sua conta de trading</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#5E6673"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="******"
            placeholderTextColor="#5E6673"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={styles.footerLink}>Não tem conta? <Text style={styles.linkHighlight}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161A25",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#1E222D",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  brandTitle: {
    color: "#F0B90B",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#848E9C",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#848E9C",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#161A25",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2E39",
  },
  errorText: {
    color: "#F6465D",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#F0B90B",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footerLink: {
    color: "#848E9C",
    fontSize: 12,
    textAlign: "center",
  },
  linkHighlight: {
    color: "#F0B90B",
    fontWeight: "bold",
  },
});
