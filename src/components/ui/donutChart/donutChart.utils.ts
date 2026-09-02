import { getCategoryColor } from "@/constants";
import { CategoryBreakdownItem, ExpenseCategory, IncomeCategory, KeyLanguage } from "@/types";

import { PieDataItem } from "./donutChart.types";

export const mappingNewPieData = (
  data: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>[],
): PieDataItem[] =>
  data.map(
    (item: CategoryBreakdownItem<ExpenseCategory | IncomeCategory>): PieDataItem => ({
      value: item.percentage,
      color: getCategoryColor(item.category),
      text: item.percentage >= 5 ? `${item.percentage}%` : "",
    }),
  );

export const donutChartCenterLabelAmountFormat = (amount: number, t: KeyLanguage): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} ${t("donutChartBillion")}`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} ${t("donutChartMillion")}`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)} ${t("donutChartThousand")}`;
  }
  return amount.toString();
};
