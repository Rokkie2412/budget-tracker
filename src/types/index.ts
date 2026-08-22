import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
} from "@/constants";
import type { TranslationKeys } from "@/i18n/translations";
import type { Dispatch, SetStateAction } from "react";

export interface IUserConnected {
  userId: string;
  password: string;
}

export type ExpenseCategory = (typeof BUDGET_CATEGORIES_EXPENSE)[number];
export type IncomeCategory = (typeof BUDGET_CATEGORIES_INCOME)[number];
export type BudgetCategory = ExpenseCategory | IncomeCategory;

export interface ITransaction {
  _id?: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  type: "OUT" | "IN";
  category?: BudgetCategory;
}

export interface Rekap {
  _id: "OUT" | "IN";
  total: number;
  count: number;
}

export interface TotalTransactionRekap {
  outgoing: number;
  incoming: number;
  total: number;
}

export type KeyLanguage = (key: TranslationKeys) => string;
export type Setter<t> = Dispatch<SetStateAction<t>>;

export type MonthSummary = {
  total: number;
  income: number;
  outcome: number;
};

export type MonthComparison = {
  percentage: string | null;
  status: "plus" | "minus" | null;
};

export interface CategoryBreakdownItem<TCategory extends string> {
  category: TCategory;
  total: number;
  percentage: number;
  percentageFormatted: string;
  count: number;
}

export interface CategoryBreakdown {
  expenses: CategoryBreakdownItem<ExpenseCategory>[];
  income: CategoryBreakdownItem<IncomeCategory>[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalTransactions: number;
  totalPages: number;
}

export type MonthSummaryData = MonthSummary & {
  year: number;
  month: number;
  categories: CategoryBreakdown;
  lastMonth: MonthSummary;
  comparison: MonthComparison;
};

export type MonthSummaryResponse = {
  message: string;
  data: MonthSummaryData;
};

export type TransactionsPaginatedData = {
  transactions: ITransaction[];
  pagination: PaginationMeta;
};

export type TransactionsPaginatedResponse = {
  message: string;
  data: TransactionsPaginatedData;
};

export type MonthlyTransactionDetailData = MonthSummary & {
  year: number;
  month: number;
  transactions: ITransaction[];
  pagination: PaginationMeta;
  categories: CategoryBreakdown;
  lastMonth: MonthSummary;
  comparison: MonthComparison;
};

export type MonthlyTransactionDetailResponse = {
  message: string;
  data: MonthlyTransactionDetailData;
};

export * from "./dashboard";
