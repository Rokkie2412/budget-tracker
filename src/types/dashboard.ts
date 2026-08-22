import type { KeyedMutator } from "swr";

import type {
  KeyLanguage,
  MonthSummaryData,
  MonthSummaryResponse,
  Setter,
  TransactionsPaginatedData,
  TransactionsPaginatedResponse,
} from "./index";

export type ErrorStateProps = {
  onRetry: () => void;
};

export type TransactionErrorStateProps = {
  onRetry: () => void;
  message?: string;
};

export type ChartProps = {
  t: KeyLanguage;
  cashFlowActive: "income" | "expense";
  setCashFlowActive: Setter<"income" | "expense">;
  data: MonthSummaryData;
};

export type TransactionSectionProps = {
  transactionList: TransactionsPaginatedData["transactions"];
  loadingGetTransactions: boolean;
  error: Error | null;
  onRetry: () => void;
};

export type UseMonthSummaryReturn = {
  data: MonthSummaryData | null;
  isLoading: boolean;
  error: Error | null;
  mutate: KeyedMutator<MonthSummaryResponse>;
  isValidating: boolean;
};

export type UseTransactionsReturn = {
  data: TransactionsPaginatedData | null;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  mutate: KeyedMutator<TransactionsPaginatedResponse>;
};
