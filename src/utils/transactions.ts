import { FilterDateList } from "@/types/transactions";

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
    case "customDate":
    default:
      return undefined;
  }
};
