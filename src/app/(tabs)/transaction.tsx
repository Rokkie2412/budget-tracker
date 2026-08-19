import ErrorState from "@/components/ui/errorState";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Pagination from "@/components/ui/pagination";
import { Text } from "@/components/ui/text";
import TransactionCard from "@/components/ui/transactionCard";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import { KeyLanguage, Setter, TransactionsPaginatedResponse } from "@/types";
import { swrFetcher } from "@/utils";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

interface useTranasctionType {
  data: TransactionsPaginatedResponse["data"] | null;
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
}

interface TypeFilterProps {
  t: KeyLanguage;
  activeValue: string;
  setActiveValue: Setter<"all" | "income" | "expense">;
}

const useTransaction = (
  userId: string | undefined,
  page: number,
  token: string | null,
  startDate?: Date | string,
  endDate?: Date | string,
): useTranasctionType => {
  const targetDate = new Date().toISOString();
  const params = new URLSearchParams({
    userId: userId ?? "",
    page: String(page),
    limit: "10",
    date: targetDate,
  });

  if (startDate) params.set("startDate", startDate.toString());
  if (endDate) params.set("endDate", endDate.toString());

  const url = `/api/getTransactions?${params.toString()}`;

  const { data, error, isLoading, mutate } =
    useSWR<TransactionsPaginatedResponse>(
      ["get-list-transaction", userId, startDate, page, endDate],
      swrFetcher(url, token),
    );

  return {
    data: data?.data ?? null,
    isLoading: isLoading && !data,
    error: error ?? null,
    mutate,
  };
};

const LoadingSpinnerState = () => (
  <View className="flex flex-1 w-full h-full items-center justify-center">
    <LoadingSpinner />
  </View>
);

const DateFilter = ({ t }: { t: KeyLanguage }): React.ReactElement => {
  const listButton = [
    { label: t("thisMonth"), value: "thisMonth", key: "1" },
    { label: t("last7Days"), value: "last7Days", key: "2" },
    { label: t("last30Days"), value: "last30Days", key: "3" },
    { label: t("customDate"), value: "customDate", key: "4" },
  ];
  return (
    <View className="flex flex-col w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pb-2 gap-1"
      >
        {listButton.map((item) => (
          <Pressable
            key={item.key}
            className="p-3 rounded-full bg-[#20304E] flex justify-center items-center"
          >
            <Text className="text-center font-semibold text-[#EAF1FF]">
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const TypeFilter = ({
  t,
  activeValue,
  setActiveValue,
}: TypeFilterProps): React.ReactElement => {
  const listButton = [
    {
      label: t("all"),
      value: "all",
      key: "0",
      onPress: () => setActiveValue("all"),
    },
    {
      label: t("incoming"),
      value: "income",
      key: "1",
      onPress: () => setActiveValue("income"),
    },
    {
      label: t("outgoing"),
      value: "expense",
      key: "2",
      onPress: () => setActiveValue("expense"),
    },
  ];
  return (
    <View className="flex-row bg-[#EEF3FA] p-1.5 rounded-xl">
      {listButton.map((item) => (
        <Pressable
          key={item.key}
          onPress={item.onPress}
          className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
            activeValue === item.value ? "bg-[#1C2A44]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeValue === item.value ? "text-[#EAF1FF]" : "text-[#1E293B]"
            }`}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const TransactionList = () => {
  const { t } = useLanguageStore();
  const { user, token } = useAuthStore((state) => state);
  const [page, setPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );

  const { data, isLoading, error, mutate } = useTransaction(
    user?.userId,
    page,
    token,
  );

  if ((error && !isLoading) || !data) {
    return <ErrorState onRetry={() => mutate()} />;
  }

  console.log("list transaction", data);
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full w-full px-6 bg-[#FFFFFF]">
        <Text className="text-4xl font-bold text-[#20304E] text-center py-6">
          {t("transactions")}
        </Text>
        <View className="w-full">
          <DateFilter t={t} />
          <TypeFilter
            t={t}
            activeValue={filterType}
            setActiveValue={setFilterType}
          />
        </View>
        <View className="flex flex-3/4 w-full mt-4 bg-[#FFFFFF] rounded-xl p-4 shadow-sm">
          {isLoading ? (
            <LoadingSpinnerState />
          ) : (
            <>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-8"
              >
                <View className=" flex flex-1 w-full">
                  {data?.transactions.map((item, index) => (
                    <View
                      key={item._id}
                      className={`flex w-full ${
                        index !== data.transactions.length - 1
                          ? "border-b border-[#E2E8F0]"
                          : ""
                      } py-2`}
                    >
                      <TransactionCard
                        key={item._id}
                        title={item.description}
                        amount={item.amount}
                        date={new Date(item.date)}
                        type={item.type}
                        category={item.category}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
              <Pagination
                totalPages={data?.pagination.totalPages ?? 1}
                page={data?.pagination.page ?? page}
                setPage={(newPage: number) => setPage(newPage)}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransactionList;
