import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Globe, LogOut } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";

export default function SettingsScreen(): React.JSX.Element {
  const { t, language, setLanguage } = useLanguageStore();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("settingsBottomMenu")}</Text>
        {user ? (
          <Text style={styles.subtitle}>User: {user.userId}</Text>
        ) : null}

        <View className="w-full max-w-sm gap-4 mt-6">
          <View className="flex-row items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <View className="flex-row items-center gap-2">
              <Globe size={20} color="#475569" />
              <Text className="text-sm font-medium text-slate-700">
                {t("selectLanguage")}
              </Text>
            </View>

            <Pressable
              onPress={(): Promise<void> =>
                setLanguage(language === "id" ? "en" : "id")
              }
              className="px-3 py-1.5 bg-blue-600 rounded-lg"
            >
              <Text className="text-xs font-bold text-white uppercase">
                {language}
              </Text>
            </Pressable>
          </View>

          <Button
            onPress={(): Promise<void> => logout()}
            className="flex-row items-center justify-center gap-2 py-3 bg-red-600 rounded-xl"
          >
            <LogOut size={18} color="#ffffff" />
            <ButtonText className="text-white font-semibold">
              {t("logout")}
            </ButtonText>
          </Button>
        </View>
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
