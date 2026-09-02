export type TypeCard = {
  type: "total" | "outgoing" | "incoming";
};

export type FinancialCardProps = TypeCard & {
  amount: string;
  data?: string;
  status?: "plus" | "minus";
};

export type DataFromLastMonthProps = {
  data?: string;
  status?: "plus" | "minus";
  subString: string;
};
