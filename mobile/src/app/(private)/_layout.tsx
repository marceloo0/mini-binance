import { Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="trade" />
      <Stack.Screen name="transactions" />
    </Stack>
  );
}
