import type { TranslationKeys } from "@/i18n/translations";
import type { Dispatch, SetStateAction } from "react";

export interface IUserConnected {
  userId: string;
  password: string;
}

export type BudgetCategory =
  | "Bills"
  | "Education"
  | "Family Needs"
  | "Food & Drinks"
  | "Gift and Chartiy"
  | "Groceries"
  | "Health & personal care"
  | "Hobby & Entertaiment"
  | "Loans"
  | "Saving & Investment"
  | "Shopping"
  | "sports"
  | "Transportaion"
  | "Traveling"
  | "Other";

export interface ITransaction {
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

export type MonthlyTransactionDetailData = MonthSummary & {
  year: number;
  month: number;
  transactions: ITransaction[];
  lastMonth: MonthSummary;
  comparison: MonthComparison;
};

export type MonthlyTransactionDetailResponse = {
  message: string;
  data: MonthlyTransactionDetailData;
};
