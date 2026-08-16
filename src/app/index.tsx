import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function HomeScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Budget Tracker</Text>
        {user ? (
          <Text style={styles.subtitle}>Logged in as: {user.userId}</Text>
        ) : null}

        <Button
          onPress={(): Promise<void> => logout()}
          className="mt-6 px-6 py-3 bg-red-600 rounded-xl"
        >
          <ButtonText className="text-white font-semibold">
            Logout (Reset Token)
          </ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
});
