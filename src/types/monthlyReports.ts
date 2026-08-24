export type UseMonthlyReports = {
  endMonth?: Date | string;
  startMonth?: Date | string;
  userId: string;
  page: number;
  token: string;
};

export type {
  MonthlyReportItem,
  MonthlyReportPaginationMeta,
  MonthlyReportResponse
} from "@/types";

