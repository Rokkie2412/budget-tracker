import MonthlyReportCard from "@/components/ui/monthlyReportCard";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import {
  MonthlyReportResponse,
  type UseMonthlyReports,
} from "@/types/monthlyReports";
import { swrFetcher } from "@/utils";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useSWR, { KeyedMutator } from "swr";

interface UseMonthlyReportsReturn {
  data: MonthlyReportResponse | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: KeyedMutator<MonthlyReportResponse>;
}

const useMonthlyReports = ({
  endMonth,
  startMonth,
  userId,
  page,
  token,
}: UseMonthlyReports): UseMonthlyReportsReturn => {
  const params = new URLSearchParams({
    userId: userId ?? "",
    page: String(page),
    limit: "12",
  });
  if (startMonth) params.set("startMonth", startMonth.toString());
  if (endMonth) params.set("endMonth", endMonth.toString());
  const url = `/api/getMonthlyReport?${params.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<MonthlyReportResponse>(
    ["get-list-monthly-reports", userId, startMonth, endMonth, page],
    swrFetcher(url, token),
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

const ReportIndexPage = (): React.JSX.Element => {
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const { t } = useLanguageStore();
  const { user, token } = useAuthStore((state) => state);

  const { mutate, isLoading, data, error } = useMonthlyReports({
    startMonth: customStartDate ?? undefined,
    endMonth: customEndDate ?? undefined,
    userId: user?.userId ?? "",
    page: 1,
    token: token ?? "",
  });

  console.log("DATA MONTHLY REPORT: ", data);
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <View className="flex flex-col h-full w-full px-6">
          <Text className="text-4xl font-bold text-[#20304E] text-center py-6">
            {t("reportPageTitle")}
          </Text>
          <ScrollView
            className="flex-1 w-full"
            contentContainerClassName="gap-3 pb-8"
            showsVerticalScrollIndicator={false}
          >
            {data?.data?.reports.map((report) => (
              <MonthlyReportCard
                key={report.date}
                date={new Date(report.date)}
                expense={report.expense}
                income={report.income}
                total={report.total}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ReportIndexPage;
