import { Stack, router, useSegments } from "expo-router";
import { useEffect } from "react";

import AuthSplashScreen from "@/components/auth-splash-screen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";

import "@/global.css";

export default function RootLayout(): React.JSX.Element {
  const { token, isLoading, loadStorageSession } = useAuthStore();
  const loadLanguage = useLanguageStore((state) => state.loadLanguage);
  const segments = useSegments();

  useEffect(() => {
    loadStorageSession();
    loadLanguage();
  }, [loadStorageSession, loadLanguage]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!token && !inAuthGroup) {
      router.replace("/login");
    } else if (token && inAuthGroup) {
      router.replace("/");
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return <AuthSplashScreen />;
  }

  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </GluestackUIProvider>
  );
}
