import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
  FILTER_DATE_LIST_TYPE,
  FILTER_TYPE,
} from "@/constants";
import { KeyLanguage, Setter, TransactionsPaginatedResponse } from "@/types";

export type FilterDateList =
  (typeof FILTER_DATE_LIST_TYPE)[keyof typeof FILTER_DATE_LIST_TYPE];

export type FilterTransactionType =
  (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];

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
  activeValue: FilterTransactionType;
  setActiveValue: Setter<FilterTransactionType>;
};

export type DateFilterType = {
  t: KeyLanguage;
  activeValue: string;
  setActiveValue: Setter<FilterDateList>;
  setShowCustomDateModal: Setter<boolean>;
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

export type FilterCatrories =
  | (typeof BUDGET_CATEGORIES_INCOME)[number]
  | (typeof BUDGET_CATEGORIES_EXPENSE)[number]
  | null;

export type FilterCategoryType = {
  t: KeyLanguage;
  activeValue: string;
  setActiveValue: Setter<FilterCatrories>;
  type: FilterTransactionType;
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
