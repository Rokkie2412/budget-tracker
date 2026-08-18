import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DonatChart from "@/components/ui/donutChart";
import Error from "@/components/ui/errorState";
import FinancialCard from "@/components/ui/financialCard";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import type {
  KeyLanguage,
  MonthlyTransactionDetailData,
  MonthlyTransactionDetailResponse,
  Setter,
} from "@/types";
import NoTransactionDataIcon from "assets/noTransactionDataIcon";
import { PlusIcon } from "lucide-react-native";

interface ButtonChartGroupProps {
  cashFlowActive: "income" | "expense";
  setCashFlowActive: Setter<"income" | "expense">;
  t: KeyLanguage;
}

interface ErrorStateProps {
  setLoading: Setter<boolean>;
  setData: Setter<MonthlyTransactionDetailData | null>;
  token: string | null;
  userId: string | undefined;
  setError: Setter<boolean>;
}

interface ChartProps {
  t: KeyLanguage;
  cashFlowActive: "income" | "expense";
  setCashFlowActive: Setter<"income" | "expense">;
  data: MonthlyTransactionDetailData;
}

const getMonthlyTransactionsData = async (
  userId: string,
  setLoading: Setter<boolean>,
  setData: Setter<MonthlyTransactionDetailData | null>,
  token: string | null,
  setError: Setter<boolean>,
): Promise<void> => {
  console.log("GOGOGO");

  try {
    setError(false);
    setLoading(true);
    const res = await fetch(
      `/api/getDetailMonthTransaction?userId=${encodeURIComponent(userId)}&date=${new Date().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const dataResponse: MonthlyTransactionDetailResponse = await res.json();
    console.log("dataResponse ->", dataResponse);
    if (dataResponse?.data) {
      setData(dataResponse.data);
    }
  } catch (error: unknown) {
    console.error("Error fetching monthly transactions:", error);
    setError(true);
  } finally {
    setLoading(false);
  }
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

const ErrorState = ({
  setLoading,
  setData,
  token,
  userId,
  setError,
}: ErrorStateProps): React.JSX.Element => {
  return (
    <View className="w-full bg-white h-full">
      <Error
        onRetry={() => {
          if (userId) {
            getMonthlyTransactionsData(
              userId,
              setLoading,
              setData,
              token,
              setError,
            );
          }
        }}
      />
    </View>
  );
};

const useGetMonthlyTransactionsDataEffect = (
  setLoading: Setter<boolean>,
  setData: Setter<MonthlyTransactionDetailData | null>,
  token: string | null,
  user: string | undefined,
  setError: Setter<boolean>,
): void => {
  useEffect(() => {
    if (user) {
      getMonthlyTransactionsData(user, setLoading, setData, token, setError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};

export default function HomeScreen(): React.JSX.Element {
  const { user, token } = useAuthStore((state) => state);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MonthlyTransactionDetailData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [cashFlowActive, setCashFlowActive] = useState<"income" | "expense">(
    "expense",
  );
  const { t } = useLanguageStore();

  useGetMonthlyTransactionsDataEffect(
    setLoading,
    setData,
    token,
    user?.userId,
    setError,
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        setLoading={setLoading}
        setData={setData}
        token={token}
        userId={user?.userId}
        setError={setError}
      />
    );
  }

  return (
    <SafeAreaView className="w-full bg-white h-full">
      <ScrollView className="p-4 gap-4">
        <FinancialCard
          type="total"
          amount={data?.total?.toString() ?? "0"}
          data={data?.comparison?.percentage ?? undefined}
          status={data?.comparison?.status ?? undefined}
        />
        <View className="flex-row gap-4 mt-2">
          <View className="flex-1">
            <FinancialCard
              type="incoming"
              amount={data?.income?.toString() ?? "0"}
            />
          </View>
          <View className="flex-1">
            <FinancialCard
              type="outgoing"
              amount={data?.outcome?.toString() ?? "0"}
            />
          </View>
        </View>
        {/* chart section */}
        {data?.transactions.length === 0 ? (
          <NoTransactionData t={t} />
        ) : (
          <ChartSection
            t={t}
            cashFlowActive={cashFlowActive}
            setCashFlowActive={setCashFlowActive}
            data={data!}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
