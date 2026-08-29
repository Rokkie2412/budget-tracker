import { CategoryBreakdownItem, ExpenseCategory, IncomeCategory, KeyLanguage } from "@/types";

export type PieDataType = {
  color: string;
  text: string;
  value: number;
};

export type DonutChartDataProps = {
  data: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>[];
  type?: "income" | "expense";
  total?: number;
};

export type PieDataItem = {
  value: number;
  color: string;
  text: string;
};

export type EmptyDataDonutChartProps = {
  type: "income" | "expense";
  calculatedRadius: number;
  calculatedInnerRadius: number;
  t: KeyLanguage;
  emptyPieData: PieDataType[];
};
