import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useSWR, { type KeyedMutator } from "swr";

import DonatChart from "@/components/ui/donutChart";
import ErrorStateComponent from "@/components/ui/errorState";
import FinancialCard from "@/components/ui/financialCard";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Pagination from "@/components/ui/pagination";
import { Text } from "@/components/ui/text";
import TransactionCard, {
  TransactionSkeleton,
} from "@/components/ui/transactionCard";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import type {
  KeyLanguage,
  MonthSummaryData,
  MonthSummaryResponse,
  Setter,
  TransactionsPaginatedData,
  TransactionsPaginatedResponse,
} from "@/types";
import { swrFetcher } from "@/utils";
import NoTransactionDataIcon from "assets/noTransactionDataIcon";
import { AlertCircle, PlusIcon, RefreshCw } from "lucide-react-native";

interface ButtonChartGroupProps {
  cashFlowActive: "income" | "expense";
  setCashFlowActive: Setter<"income" | "expense">;
  t: KeyLanguage;
}

interface ErrorStateProps {
  onRetry: () => void;
}

interface TransactionErrorStateProps {
  onRetry: () => void;
  message?: string;
}

interface ChartProps {
  t: KeyLanguage;
  cashFlowActive: "income" | "expense";
  setCashFlowActive: Setter<"income" | "expense">;
  data: MonthSummaryData;
}

interface TransactionSectionProps {
  transactionList: TransactionsPaginatedData["transactions"];
  loadingGetTransactions: boolean;
  error: Error | null;
  onRetry: () => void;
}

interface UseMonthSummaryReturn {
  data: MonthSummaryData | null;
  isLoading: boolean;
  error: Error | null;
  mutate: KeyedMutator<MonthSummaryResponse>;
  isValidating: boolean;
}

interface UseTransactionsReturn {
  data: TransactionsPaginatedData | null;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  mutate: KeyedMutator<TransactionsPaginatedResponse>;
}

const useMonthSummary = (
  userId: string | undefined,
  token: string | null,
  date?: string | Date,
): UseMonthSummaryReturn => {
  const targetDate = date
    ? new Date(date).toISOString()
    : new Date().toISOString();
  const url = `/api/getMonthSummary?userId=${encodeURIComponent(userId ?? "")}&date=${targetDate}`;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<MonthSummaryResponse>(
      ["get-monthly-transactions", userId, targetDate], //listener
      swrFetcher(url, token), //call api
    );

  return {
    data: data?.data ?? null,
    isLoading: isLoading && !data,
    isValidating,
    error: error ?? null,
    mutate,
  };
};

const useTransactions = (
  userId: string | undefined,
  token: string | null,
  page = 1,
  limit = 10,
  date?: string | Date,
): UseTransactionsReturn => {
  const targetDate = date
    ? new Date(date).toISOString()
    : new Date().toISOString();
  const url = `/api/getTransactions?userId=${encodeURIComponent(userId ?? "")}&date=${targetDate}&page=${page}&limit=${limit}`;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<TransactionsPaginatedResponse>(
      ["get-transactions", userId, targetDate, page, limit], // listener
      swrFetcher(url, token), //call api
    );

  return {
    data: data?.data ?? null,
    isLoading: isLoading && !data,
    isValidating,
    error: error ?? null,
    mutate,
  };
};

const ButtonChartGroup = ({
  cashFlowActive,
  setCashFlowActive,
  t,
}: ButtonChartGroupProps): React.JSX.Element => (
  <View className="flex-row bg-[#EEF3FA] p-1.5 rounded-xl">
    <Pressable
      className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
        cashFlowActive === "expense" ? "bg-[#1C2A44]" : "bg-transparent"
      }`}
      onPress={() => setCashFlowActive("expense")}
    >
      <Text
        className={`font-semibold ${
          cashFlowActive === "expense" ? "text-[#8EA2C6]" : "text-[#1E293B]"
        }`}
      >
        {t("outgoing")}
      </Text>
    </Pressable>
    <Pressable
      className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
        cashFlowActive === "income" ? "bg-[#1C2A44]" : "bg-transparent"
      }`}
      onPress={() => setCashFlowActive("income")}
    >
      <Text
        className={`font-semibold ${
          cashFlowActive === "income" ? "text-[#8EA2C6]" : "text-[#1E293B]"
        }`}
      >
        {t("incoming")}
      </Text>
    </Pressable>
  </View>
);

const NoTransactionData = ({ t }: { t: KeyLanguage }): React.JSX.Element => {
  return (
    <View className="flex flex-col gap-2 bg-[#FFFFFF] p-4 shadow-sm rounded-xl mt-2 justify-center items-center h-100">
      <NoTransactionDataIcon />
      <Text className="text-2xl font-bold text-center">
        {t("noTransactionDataTitle")}
      </Text>
      <Text className="text-md text-center text-[#1E293B] px-4">
        {t("noTransactionData")}
      </Text>
      <Pressable className="mt-4 flex-row items-center gap-1 bg-[#1C2A44] px-4 py-2 rounded-xl">
        <PlusIcon size={18} color="#ffffff" />
        <Text className="text-white font-semibold text-lg">
          {t("noTransactionDataButton")}
        </Text>
      </Pressable>
    </View>
  );
};

const ChartSection = ({
  t,
  cashFlowActive,
  setCashFlowActive,
  data,
}: ChartProps): React.JSX.Element => (
  <View className="flex flex-col gap-4 bg-[#FFFFFF] p-4 shadow-sm rounded-xl mt-2">
    <View className="flex-row justify-between">
      <Text className="text-xl font-bold">{t("cashflow")}</Text>
      <Text>{t("detailCashflow")}</Text>
    </View>
    <ButtonChartGroup
      t={t}
      cashFlowActive={cashFlowActive}
      setCashFlowActive={setCashFlowActive}
    />
    <View>
      <DonatChart
        total={cashFlowActive === "expense" ? data?.outcome : data?.income}
        type={cashFlowActive === "expense" ? "expense" : "income"}
        data={
          cashFlowActive === "expense"
            ? (data?.categories.expenses ?? [])
            : (data?.categories.income ?? [])
        }
      />
    </View>
  </View>
);

const ErrorState = ({ onRetry }: ErrorStateProps): React.JSX.Element => {
  return (
    <View className="w-full bg-white h-full">
      <ErrorStateComponent onRetry={onRetry} />
    </View>
  );
};

const TransactionErrorState = ({
  onRetry,
  message,
}: TransactionErrorStateProps): React.JSX.Element => {
  const { t } = useLanguageStore();

  return (
    <View className="items-center justify-center py-8 px-4 bg-slate-50/80 rounded-xl border border-slate-100 my-2">
      <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-3">
        <AlertCircle size={24} color="#EF4444" strokeWidth={2} />
      </View>
      <Text className="text-base font-bold text-[#20304E] text-center mb-1">
        {t("errorTitle")}
      </Text>
      <Text className="text-xs text-slate-500 text-center mb-4 max-w-65 leading-relaxed">
        {message || t("errorDescription")}
      </Text>
      <Pressable
        onPress={onRetry}
        className="flex-row items-center justify-center gap-2 bg-[#20304E] active:bg-[#152136] px-4 py-2.5 rounded-lg shadow-sm"
      >
        <RefreshCw size={14} color="#FFFFFF" strokeWidth={2.2} />
        <Text className="text-white text-xs font-semibold tracking-wide">
          {t("retry")}
        </Text>
      </Pressable>
    </View>
  );
};

const TransactionSection = ({
  transactionList,
  loadingGetTransactions,
  error,
  onRetry,
}: TransactionSectionProps): React.JSX.Element => {
  if (loadingGetTransactions) {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        className="max-h-96"
      >
        {[...Array(5)].map((_, index) => (
          <TransactionSkeleton key={index} />
        ))}
      </ScrollView>
    );
  }

  if (error && !loadingGetTransactions) {
    return <TransactionErrorState onRetry={onRetry} message={error?.message} />;
  }

  if (!transactionList || transactionList.length === 0) {
    return <></>;
  }

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
      className="max-h-96"
    >
      {transactionList?.map((item, index) => (
        <View
          key={index}
          className={`p-2 ${
            index === transactionList.length - 1
              ? "border-b-0"
              : "border-b border-[#D7E2FF]"
          }`}
        >
          <TransactionCard
            title={item.description}
            date={item.date}
            category={item.category}
            type={item.type}
            amount={item.amount}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default function HomeScreen(): React.JSX.Element {
  const { user, token } = useAuthStore((state) => state);
  const [page, setPage] = useState<number>(1);
  const [cashFlowActive, setCashFlowActive] = useState<"income" | "expense">(
    "expense",
  );
  const { t } = useLanguageStore();

  const {
    data: monthSummary,
    isLoading: isMonthSummaryLoading,
    isValidating: isMonthSummaryValidating,
    error: monthSummaryError,
    mutate: mutateMonthSummary,
  } = useMonthSummary(user?.userId, token);

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isValidating: isTransactionsValidating,
    error: transactionsError,
    mutate: mutateTransactions,
  } = useTransactions(user?.userId, token, page, 10);

  const handleRefresh = (): void => {
    setPage(1);
    mutateMonthSummary();
    mutateTransactions();
  };

  if (isMonthSummaryLoading) {
    return <LoadingSpinner />;
  }

  if (monthSummaryError) {
    return (
      <ErrorState
        onRetry={() => {
          mutateMonthSummary();
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView
          className="p-4 gap-4"
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isMonthSummaryValidating || isTransactionsValidating}
              onRefresh={handleRefresh}
            />
          }
        >
          <FinancialCard
            type="total"
            amount={monthSummary?.total?.toString() ?? "0"}
            data={monthSummary?.comparison?.percentage ?? undefined}
            status={monthSummary?.comparison?.status ?? undefined}
          />
          <View className="flex-row gap-4 mt-2">
            <View className="flex-1">
              <FinancialCard
                type="incoming"
                amount={monthSummary?.income?.toString() ?? "0"}
              />
            </View>
            <View className="flex-1">
              <FinancialCard
                type="outgoing"
                amount={monthSummary?.outcome?.toString() ?? "0"}
              />
            </View>
          </View>

          {/* Chart Section */}
          {!monthSummary ? (
            <NoTransactionData t={t} />
          ) : (
            <ChartSection
              t={t}
              cashFlowActive={cashFlowActive}
              setCashFlowActive={setCashFlowActive}
              data={monthSummary}
            />
          )}

          {/* Transaction History & Pagination */}
          {monthSummary && (
            <View className="flex p-4 pb-1 bg-white mt-4 rounded-xl">
              <View className="flex flex-row justify-between py-1">
                <Text className="text-xl font-bold">
                  {t("historyThisMonthTitle")}
                </Text>
                <Pressable>
                  <Text>{t("viewTransactionButton")}</Text>
                </Pressable>
              </View>
              <TransactionSection
                loadingGetTransactions={
                  isTransactionsLoading ||
                  (isTransactionsValidating && !transactions)
                }
                transactionList={transactions?.transactions ?? []}
                error={transactionsError}
                onRetry={() => {
                  mutateTransactions();
                }}
              />
              {!isTransactionsLoading && !transactionsError && (
                <Pagination
                  totalPages={transactions?.pagination.totalPages ?? 1}
                  page={transactions?.pagination.page ?? page}
                  setPage={(newPage: number) => setPage(newPage)}
                />
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
