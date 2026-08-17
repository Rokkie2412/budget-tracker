import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Error from "@/components/ui/errorState";
import FinancialCard from "@/components/ui/financialCard";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useAuthStore } from "@/stores/authStore";
import type {
  MonthlyTransactionDetailData,
  MonthlyTransactionDetailResponse,
  Setter,
} from "@/types";

const getMonthlyTransactionsData = async (
  userId: string,
  setLoading: Setter<boolean>,
  setData: Setter<MonthlyTransactionDetailData | null>,
  token: string | null,
): Promise<void> => {
  try {
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
  } finally {
    setLoading(false);
  }
};

const useGetMonthlyTransactionsDataEffect = (
  setLoading: Setter<boolean>,
  setData: Setter<MonthlyTransactionDetailData | null>,
  token: string | null,
  user: string | undefined,
) => {
  useEffect(() => {
    if (user) {
      getMonthlyTransactionsData(user, setLoading, setData, token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};

export default function HomeScreen(): React.JSX.Element {
  const { user, token } = useAuthStore((state) => state);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MonthlyTransactionDetailData | null>(null);

  useGetMonthlyTransactionsDataEffect(setLoading, setData, token, user?.userId);

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  if (!loading && !data) {
    return (
      <SafeAreaView className="w-full bg-white h-full">
        <Error
          onRetry={() => {
            if (user?.userId) {
              getMonthlyTransactionsData(
                user.userId,
                setLoading,
                setData,
                token,
              );
            }
          }}
        />
      </SafeAreaView>
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
        <View className="flex-row gap-4">
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
      </ScrollView>
    </SafeAreaView>
  );
}
