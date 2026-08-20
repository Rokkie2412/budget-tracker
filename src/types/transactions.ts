import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
} from "@/constants";
import { KeyLanguage, Setter, TransactionsPaginatedResponse } from "@/types";

export type FilterDateList =
  | "thisMonth"
  | "last7Days"
  | "last30Days"
  | "customDate";

export type useTranasctionType = {
  data: TransactionsPaginatedResponse["data"] | null;
  isLoading: boolean;
  error: any;
  mutate: () => Promise<any>;
  startDate?: Date | string;
  endDate?: Date | string;
  transactionType?: string;
  category?: string;
};

export type TypeFilterProps = {
  t: KeyLanguage;
  activeValue: string;
  setActiveValue: Setter<"all" | "income" | "expense">;
};

export type DateFilterType = {
  t: KeyLanguage;
  activeValue: string;
  setActiveIndex: Setter<FilterDateList>;
};

export type FilterCategoryIncomeType = {
  t: KeyLanguage;
  activeValue: string | null;
  setActiveValue: Setter<(typeof BUDGET_CATEGORIES_INCOME)[number] | null>;
};

export type FilterCategoryExpenseType = {
  t: KeyLanguage;
  activeValue: string | null;
  setActiveValue: Setter<(typeof BUDGET_CATEGORIES_EXPENSE)[number] | null>;
};

export type FilterCategoryType = {
  t: KeyLanguage;
  activeValue: string;
  setActiveValue: Setter<
    | (typeof BUDGET_CATEGORIES_INCOME)[number]
    | (typeof BUDGET_CATEGORIES_EXPENSE)[number]
    | null
  >;
  type: "all" | "income" | "expense";
};

export type UseTransactionParams = {
  userId: string | undefined;
  page: number;
  token: string | null;
  startDate?: Date | string;
  endDate?: Date | string;
  transactionType?: string;
  category?: string | null;
};
