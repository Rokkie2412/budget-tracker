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
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboardBottomMenu"),
          tabBarIcon: ({ color, size }): React.JSX.Element => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
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
