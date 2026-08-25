import { Tabs } from "expo-router";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PieChart,
  Settings,
} from "lucide-react-native";
import React from "react";

import { useLanguageStore } from "@/stores/languageStore";

export default function TabLayout(): React.JSX.Element {
  const { t } = useLanguageStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 8,
        },
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("dashboardBottomMenu"),
          tabBarIcon: ({ color, size }): React.JSX.Element => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t("transactionBottomMenu"),
          tabBarIcon: ({ color, size }): React.JSX.Element => (
            <ArrowLeftRight size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t("reportBottomMenu"),
          tabBarIcon: ({ color, size }): React.JSX.Element => (
            <PieChart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settingsBottomMenu"),
          tabBarIcon: ({ color, size }): React.JSX.Element => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
