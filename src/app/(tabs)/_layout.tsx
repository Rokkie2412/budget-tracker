import React, { useState } from "react";
import { View } from "react-native";
import { Tabs, usePathname } from "expo-router";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PieChart,
  Settings,
} from "lucide-react-native";

import FloatingButton from "@/components/ui/floatingButton";
import AddTransactionModal from "@/components/ui/modalAddTransaction";
import { useLanguageStore } from "@/stores/languageStore";

export default function TabLayout(): React.JSX.Element {
  const [showAddTransactionModal, setShowAddTransactionModal] =
    useState<boolean>(false);
  const { t } = useLanguageStore();
  const pathname = usePathname();

  const showFloatingButton =
    pathname.includes("dashboard") || pathname.includes("transactions");

  return (
    <View style={{ flex: 1 }}>
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
      {showFloatingButton && (
        <FloatingButton
          onPress={(): void => {
            setShowAddTransactionModal(true);
          }}
        />
      )}
      <AddTransactionModal
        open={showAddTransactionModal}
        handleClose={(): void => {
          setShowAddTransactionModal(false);
        }}
      />
    </View>
  );
}
