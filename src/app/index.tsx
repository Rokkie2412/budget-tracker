import { Redirect } from "expo-router";

import AuthSplashScreen from "@/components/ui/authSplashScreen";
import { useAuthStore } from "@/stores/authStore";

export default function Index(): React.JSX.Element {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return <AuthSplashScreen />;
  }

  if (token) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/login" />;
}
