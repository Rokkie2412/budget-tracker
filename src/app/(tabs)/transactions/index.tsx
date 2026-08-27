import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useSWR from "swr";

import ButtonGroup from "@/components/ui/buttonGroup";
import CustomDateModal from "@/components/ui/customDateModal";
import EmptyComponent from "@/components/ui/emptyState";
import ErrorComponent from "@/components/ui/errorState";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Pagination from "@/components/ui/pagination";
import { Text } from "@/components/ui/text";
import TransactionCard from "@/components/ui/transactionCard";
import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
} from "@/constants";
import { useRefetchWhenFocus } from "@/hooks";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import { Setter, TransactionsPaginatedResponse } from "@/types";
import {
  ContentBodyProps,
  DateFilterType,
  FilterCategoryExpenseType,
  FilterCategoryIncomeType,
  FilterCategoryType,
  FilterCatrories,
  FilterDateList,
  FilterTransactionType,
  MainContentProps,
  TypeFilterProps,
  useTranasctionType,
  UseTransactionParams,
} from "@/types/transactions";
import { swrFetcher } from "@/utils";
import {
  getDateRangeByFilter,
  getListButtonDateRange,
  listButtonTransactionsType,
} from "@/utils/transactions";

const useTransaction = ({
  userId,
  page,
  token,
  startDate,
  endDate,
  transactionType,
  category,
}: UseTransactionParams): useTranasctionType => {
  const targetDate = new Date().toISOString();
  const params = new URLSearchParams({
    userId: userId ?? "",
    page: String(page),
    limit: "10",
    date: targetDate,
  });
  if (startDate) params.set("startDate", startDate.toString());
  if (endDate) params.set("endDate", endDate.toString());
  if (transactionType && transactionType !== "all") {
    params.set("type", transactionType);
  }
  if (category && category !== "all") {
    params.set("category", category);
  }
  const url = `/api/getTransactions?${params.toString()}`;
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<TransactionsPaginatedResponse>(
      [
        "get-list-transaction",
        userId,
        startDate,
        page,
        endDate,
        transactionType,
        category,
      ],
      swrFetcher(url, token),
    );
  return {
    data: data?.data ?? null,
    isLoading: isLoading && !data,
    error: error ?? null,
    mutate,
    isValidating,
  };
};

const LoadingSpinnerState = () => (
  <View className="flex flex-1 w-full h-full items-center justify-center">
    <LoadingSpinner />
  </View>
);

const DateFilter = ({
  t,
  activeValue,
  setActiveValue,
  setShowCustomDateModal,
  isDisabled,
}: DateFilterType): React.ReactElement => {
  const listButton = getListButtonDateRange(
    t,
    setActiveValue,
    setShowCustomDateModal,
  );

  return (
    <View className="flex flex-col w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pb-2 gap-1"
      >
        {listButton.map((item) => (
          <Pressable
            disabled={isDisabled}
            key={item.key}
            className={`p-3 rounded-full  flex justify-center items-center ${activeValue === item.value ? "bg-[#20304E]" : "bg-[#EEF3FA]"}`}
            onPress={item.onPress}
          >
            <Text
              className={`text-center font-semibold ${activeValue === item.value ? "text-[#EAF1FF]" : "text-[#1E293B]"}`}
            >
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
  isDisabled,
}: TypeFilterProps): React.ReactElement => {
  const listButton = listButtonTransactionsType(t, setActiveValue);
  return (
    <ButtonGroup
      isDisabled={isDisabled}
      buttonArray={listButton}
      activeValue={activeValue}
    />
  );
};

const FilterCategoryIncome = ({
  activeValue,
  setActiveValue,
}: FilterCategoryIncomeType): React.ReactElement[] => {
  const newMappedList = () => {
    return BUDGET_CATEGORIES_INCOME.map((item, idx) => ({
      label: item,
      value: item,
      key: String(idx),
      onPress: () => {
        if (activeValue === item) {
          setActiveValue(null);
        } else {
          setActiveValue(item);
        }
      },
    }));
  };

  return newMappedList().map((item) => (
    <Pressable
      key={item.key}
      onPress={item.onPress}
      className={`px-4 py-2 items-center justify-center rounded-md ${
        activeValue === item.value ? "bg-[#20304E]" : "bg-[#EEF3FA]"
      }`}
    >
      <Text
        className={`text-center text-sm font-semibold ${
          activeValue === item.value ? "text-[#EAF1FF]" : "text-[#1E293B]"
        }`}
      >
        {item.label}
      </Text>
    </Pressable>
  ));
};

const FilterCategoryExpense = ({
  t,
  activeValue,
  setActiveValue,
}: FilterCategoryExpenseType): React.ReactElement[] => {
  const newMappedList = () => {
    return BUDGET_CATEGORIES_EXPENSE.map((item, idx) => ({
      label: item,
      value: item,
      key: String(idx),
      onPress: () => {
        if (activeValue === item) {
          setActiveValue(null);
        } else {
          setActiveValue(item);
        }
      },
    }));
  };

  return newMappedList().map((item) => (
    <Pressable
      key={item.key}
      onPress={item.onPress}
      className={`px-4 py-2 items-center justify-center rounded-md ${
        activeValue === item.value ? "bg-[#20304E]" : "bg-[#EEF3FA]"
      }`}
    >
      <Text
        className={`text-center text-sm font-semibold ${
          activeValue === item.value ? "text-[#EAF1FF]" : "text-[#1E293B]"
        }`}
      >
        {item.label}
      </Text>
    </Pressable>
  ));
};

const FilterCategory = ({
  t,
  activeValue,
  setActiveValue,
  type,
}: FilterCategoryType): React.ReactElement => {
  return (
    <View className="w-full mt-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center gap-2 pb-1"
      >
        {(type === "all" || type === "income") && (
          <FilterCategoryIncome
            activeValue={
              activeValue as (typeof BUDGET_CATEGORIES_INCOME)[number]
            }
            setActiveValue={
              setActiveValue as Setter<
                (typeof BUDGET_CATEGORIES_INCOME)[number] | null
              >
            }
          />
        )}
        {(type === "all" || type === "expense") && (
          <FilterCategoryExpense
            activeValue={
              activeValue as (typeof BUDGET_CATEGORIES_EXPENSE)[number]
            }
            setActiveValue={
              setActiveValue as Setter<
                (typeof BUDGET_CATEGORIES_EXPENSE)[number] | null
              >
            }
            t={t}
          />
        )}
      </ScrollView>
    </View>
  );
};

const useClearCategoryEffect = (
  filterType: FilterTransactionType,
  filterCategory: string,
  setFilterCategory: Setter<
    | (typeof BUDGET_CATEGORIES_INCOME)[number]
    | (typeof BUDGET_CATEGORIES_EXPENSE)[number]
    | null
  >,
) => {
  useEffect(() => {
    if (filterCategory) {
      setFilterCategory(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);
};

const ContentBody = ({
  data,
  page,
  setPage,
  isValidating,
  onRefresh,
}: ContentBodyProps) => {
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isValidating} onRefresh={onRefresh} />
        }
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
  );
};

const MainContent = ({
  loading,
  error,
  data,
  page,
  setPage,
  mutate,
  isValidating,
  onRefresh,
}: MainContentProps): React.ReactElement => {
  if (loading) {
    return <LoadingSpinnerState />;
  }

  if (error) {
    return <ErrorComponent onRetry={mutate} />;
  }

  if (!data || data.transactions.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <ContentBody
      data={data}
      page={page}
      setPage={setPage}
      isValidating={isValidating}
      onRefresh={onRefresh}
    />
  );
};

const TransactionList = () => {
  const { t } = useLanguageStore();
  const { user, token } = useAuthStore((state) => state);
  const [page, setPage] = useState<number>(1);
  const [filterDate, setFilterDate] = useState<FilterDateList>("thisMonth");
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCatrories>(null);
  const [filterType, setFilterType] = useState<FilterTransactionType>("all");

  const dateRange = getDateRangeByFilter(
    filterDate,
    customStartDate ?? undefined,
    customEndDate ?? undefined,
  );

  const { data, isLoading, error, mutate, isValidating } = useTransaction({
    userId: user?.userId,
    page,
    token,
    startDate: dateRange?.startDate?.toISOString(),
    endDate: dateRange?.endDate?.toISOString(),
    transactionType: filterType,
    category: filterCategory,
  });

  useClearCategoryEffect(
    filterType,
    filterCategory as string,
    setFilterCategory,
  );

  useRefetchWhenFocus(mutate);

  const handleRefresh = () => {
    setPage(1);
    mutate();
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" animated />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex flex-col flex-1 w-full px-6 bg-[#FFFFFF]">
          <Text className="text-4xl font-bold text-[#20304E] text-center py-6">
            {t("transactions")}
          </Text>
          <View className="w-full">
            <DateFilter
              isDisabled={isLoading || error}
              t={t}
              activeValue={filterDate}
              setActiveValue={setFilterDate}
              setShowCustomDateModal={setShowCustomDate}
            />
            <TypeFilter
              t={t}
              activeValue={filterType}
              setActiveValue={setFilterType}
              isDisabled={isLoading || error}
            />
            <FilterCategory
              t={t}
              activeValue={filterCategory as string}
              setActiveValue={setFilterCategory}
              type={filterType}
            />
          </View>
          <View className="flex flex-3/4 w-full mt-4 bg-[#FFFFFF] rounded-xl p-4 mb-4 shadow-sm">
            <MainContent
              isValidating={isValidating}
              onRefresh={handleRefresh}
              loading={isLoading}
              error={error}
              data={data}
              page={page}
              setPage={setPage}
              mutate={mutate}
            />
          </View>
        </View>
        <CustomDateModal
          open={showCustomDate}
          setOpen={setShowCustomDate}
          initialStartDate={customStartDate}
          initialEndDate={customEndDate}
          onApply={(start: string, end: string): void => {
            setCustomStartDate(start);
            setCustomEndDate(end);
            setFilterDate("customDate");
            setPage(1);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default TransactionList;
