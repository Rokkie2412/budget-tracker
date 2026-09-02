export type MonthlyReportCardProps = {
  date: Date;
  income: number;
  expense: number;
  total: number;
  onPress?: () => void;
};
