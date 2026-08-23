import { ButtonArray } from "@/components/ui/buttonGroup";
import { FILTER_DATE_LIST_TYPE, FILTER_TYPE } from "@/constants";
import { KeyLanguage, Setter } from "@/types";
import { FilterDateList, FilterTransactionType } from "@/types/transactions";

export const ThisMonthStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};

export const ThisMonthEnd = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

export const Last7DaysStart = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6,
    0,
    0,
    0,
    0,
  );
};

export const Last7DaysEnd = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
};

export const Last30DaysStart = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 29,
    0,
    0,
    0,
    0,
  );
};

export const Last30DaysEnd = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
};

export const getDateRangeByFilter = (
  filter: FilterDateList,
  startCustomDate?: Date | string,
  endCustomDate?: Date | string,
): { startDate: Date; endDate: Date } | undefined => {
  switch (filter) {
    case "thisMonth":
      return {
        startDate: ThisMonthStart(),
        endDate: ThisMonthEnd(),
      };
    case "last7Days":
      return {
        startDate: Last7DaysStart(),
        endDate: Last7DaysEnd(),
      };
    case "last30Days":
      return {
        startDate: Last30DaysStart(),
        endDate: Last30DaysEnd(),
      };
    case "customDate": {
      if (!startCustomDate || !endCustomDate) return undefined;
      const start = new Date(startCustomDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endCustomDate);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: start,
        endDate: end,
      };
    }
    default:
      return undefined;
  }
};

export const getListButtonDateRange = (
  t: KeyLanguage,
  onPress: (filter: FilterDateList) => void,
  setShowCustomDateModal: Setter<boolean>,
) => [
  {
    label: t("thisMonth"),
    value: FILTER_DATE_LIST_TYPE.THIS_MONTH,
    key: "1",
    onPress: () => onPress(FILTER_DATE_LIST_TYPE.THIS_MONTH),
  },
  {
    label: t("last7Days"),
    value: FILTER_DATE_LIST_TYPE.LAST7_DAYS,
    key: "2",
    onPress: () => onPress(FILTER_DATE_LIST_TYPE.LAST7_DAYS),
  },
  {
    label: t("last30Days"),
    value: FILTER_DATE_LIST_TYPE.LAST30_DAYS,
    key: "3",
    onPress: () => onPress(FILTER_DATE_LIST_TYPE.LAST30_DAYS),
  },
  {
    label: t("customDate"),
    value: FILTER_DATE_LIST_TYPE.CUSTOM_DATE,
    key: "4",
    onPress: () => setShowCustomDateModal(true),
  },
];

export const listButtonTransactionsType = (
  t: KeyLanguage,
  setActiveValue: Setter<FilterTransactionType>,
): ButtonArray[] => [
  {
    buttonLabel: t("all"),
    value: FILTER_TYPE.ALL,
    onPress: () => setActiveValue(FILTER_TYPE.ALL),
  },
  {
    buttonLabel: t("incoming"),
    value: FILTER_TYPE.INCOME,
    onPress: () => setActiveValue(FILTER_TYPE.INCOME),
  },
  {
    buttonLabel: t("outgoing"),
    value: FILTER_TYPE.EXPENSE,
    onPress: () => setActiveValue(FILTER_TYPE.EXPENSE),
  },
];
