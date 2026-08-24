import { Stack } from "expo-router";

import { AppProvider } from "@/infrastructure/providers/app-provider";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true)

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
