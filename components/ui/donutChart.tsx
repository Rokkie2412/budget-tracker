import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import { Text } from "@/components/ui/text";
import { getCategoryColor } from "@/constants";
import { useLanguageStore } from "@/stores/languageStore";
import type {
  CategoryBreakdownItem,
  ExpenseCategory,
  IncomeCategory,
} from "@/types";

interface DonutChartDataProps {
  data: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>[];
  type?: "income" | "expense";
  total?: number;
}

interface PieDataItem {
  value: number;
  color: string;
  text: string;
}

const mapNewPieData = (
  data: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>[],
): PieDataItem[] =>
  data.map(
    (
      item: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>,
    ): PieDataItem => ({
      value: item.percentage,
      color: getCategoryColor(item.category),
      text: item.percentage >= 5 ? `${item.percentage}%` : "",
    }),
  );

const formatAmount = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} JT`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)} RB`;
  }
  return amount.toString();
};

const DonatChart = ({
  data,
  total = 0,
  type = "expense",
}: DonutChartDataProps): React.JSX.Element => {
  const { t } = useLanguageStore();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const calculatedRadius = Math.min(
    Math.max(Math.round(screenWidth * 0.22), 70),
    100,
  );
  const calculatedInnerRadius = Math.round(calculatedRadius * 0.65);

  const maxScrollHeight = Math.min(
    Math.max(Math.round(screenHeight * 0.22), 140),
    200,
  );

  if (!data || data.length === 0) {
    const emptyPieData = [{ value: 100, color: "#E2E8F0", text: "" }];
    return (
      <View className="flex w-full">
        <View className="flex items-center justify-center py-2">
          <PieChart
            donut
            radius={calculatedRadius}
            innerRadius={calculatedInnerRadius}
            innerCircleColor="#FFFFFF"
            data={emptyPieData}
            centerLabelComponent={() => (
              <View className="items-center justify-center">
                <Text className="text-base font-bold text-[#94A3B8]">0</Text>
                <Text className="text-[10px] font-semibold text-gray-400 tracking-wider">
                  {type === "income"
                    ? t("chartMiddleTextIncome")
                    : t("chartMiddleTextExpense")}
                </Text>
              </View>
            )}
          />
        </View>
        <View className="mt-4 w-full bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-4 items-center justify-center">
          <Text className="text-sm font-medium text-[#64748B] text-center">
            {type === "income"
              ? t("noCategoryDataIncome")
              : t("noCategoryDataExpense")}
          </Text>
        </View>
      </View>
    );
  }

  const pieData = mapNewPieData(data);

  return (
    <View className="flex w-full">
      <View className="flex items-center justify-center py-2">
        <PieChart
          donut
          radius={calculatedRadius}
          innerRadius={calculatedInnerRadius}
          innerCircleColor="#FFFFFF"
          data={pieData}
          centerLabelComponent={() => (
            <View className="items-center justify-center">
              <Text className="text-base font-bold text-[#1E293B]">
                {type === "income" ? formatAmount(total) : formatAmount(total)}
              </Text>
              <Text className="text-[10px] font-semibold text-gray-500 tracking-wider">
                {type === "income"
                  ? t("chartMiddleTextIncome")
                  : t("chartMiddleTextExpense")}
              </Text>
            </View>
          )}
        />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        className="mt-4 w-full px-1"
        style={{ maxHeight: maxScrollHeight }}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {data.map(
          (
            item: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>,
            index: number,
          ): React.JSX.Element => (
            <View
              key={item.category}
              className={`flex-row justify-between items-center ${
                index === data.length - 1
                  ? "border-b-0"
                  : "border-b border-[#E2E8F0] pb-2.5"
              } mb-3`}
            >
              <View className="flex-row items-center gap-2">
                <View
                  className="w-3.5 h-3.5 rounded-full mr-2"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                />
                <Text className="text-sm font-medium text-[#334155]">
                  {item.category}
                </Text>
              </View>
              <Text className="text-sm font-bold text-[#1E293B]">
                {item.percentage}%
              </Text>
            </View>
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default DonatChart;
