import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useLanguageStore } from "@/stores/languageStore";

type MonthlyReportCardProps = {
  date: Date;
  income: number;
  expense: number;
  total: number;
  onPress?: () => void;
};

export const MonthlyReportCard = ({
  date,
  income,
  expense,
  total,
  onPress,
}: MonthlyReportCardProps): React.JSX.Element => {
  const { t, language } = useLanguageStore();

  const formattedDate = new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedIncome = `Rp ${income.toLocaleString("id-ID")}`;
  const formattedExpense = `Rp ${expense.toLocaleString("id-ID")}`;

  const formattedTotal =
    total > 0
      ? `+Rp ${total.toLocaleString("id-ID")}`
      : total < 0
        ? `-Rp ${Math.abs(total).toLocaleString("id-ID")}`
        : `Rp ${total.toLocaleString("id-ID")}`;

  const totalTextColor =
    total > 0 ? "text-[#007A55]" : total < 0 ? "text-[#DC2626]" : "text-[#1E293B]";

  const content = (
    <View className="w-full bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEF2F6] shadow-sm">
      <View className="flex-row justify-between items-center pb-3.5 mb-3.5 border-b border-[#F1F5F9]">
        <Text className="font-bold text-lg text-[#0F172A]">{formattedDate}</Text>
        <ChevronRight size={20} color="#64748B" />
      </View>

      <View className="flex-row justify-between items-center mb-3.5">
        <View className="flex-col">
          <Text className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">
            {t("incoming")}
          </Text>
          <Text className="text-lg font-bold text-[#0F172A]">{formattedIncome}</Text>
        </View>
        <View className="flex-col">
          <Text className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">
            {t("outgoing")}
          </Text>
          <Text className="text-lg font-bold text-[#0F172A]">{formattedExpense}</Text>
        </View>
      </View>

      <View className="bg-[#F0F5FF] rounded-xl px-4 py-3.5 flex-row justify-between items-center">
        <Text className="text-xs font-bold text-[#1E293B] tracking-wider uppercase">
          {t("netBalance")}
        </Text>
        <Text className={`text-lg font-bold ${totalTextColor}`}>{formattedTotal}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="w-full">
        {content}
      </Pressable>
    );
  }

  return content;
};

export default MonthlyReportCard;
