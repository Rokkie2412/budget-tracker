export type TransactionCardProps = {
  title: string;
  amount: number;
  date: Date;
  type: "IN" | "OUT";
  category?: string;
};
