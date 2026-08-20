export const TRANSACTION_TYPE = {
  IN: "IN",
  OUT: "OUT",
} as const;

export const ENC_ALGORITHM = "aes-256-cbc" as const;

export const HELP_COMMANDS = [
  { command: "masuk [nominal] [ket]", desc: "Catat pemasukan" },
  { command: "[nomimal] [ket]", desc: "Catat pengeluaran" },
  { command: "[ket] [nominal]", desc: "Catat pengeluaran" },
  { command: ".rekap", desc: "Lihat laporan bulan ini" },
  {
    command: ".cek | .history | .last [angka]",
    desc: "Lihat histori transaksi",
  },
  { command: ".batal", desc: "Hapus transaksi terakhir" },
];

export const BUDGET_CATEGORIES_EXPENSE = [
  "Bills",
  "Education",
  "Family Needs",
  "Food & Drinks",
  "Gift and Charity",
  "Groceries",
  "Health & Personal Care",
  "Hobby & Entertainment",
  "Loans",
  "Lending & Receivables",
  "Saving & Investment",
  "Shopping",
  "Sports",
  "Transportation",
  "Traveling",
  "Debt",
  "Other Expense",
] as const;

export const BUDGET_CATEGORIES_INCOME = [
  "Salary",
  "Business & Profit",
  "Freelance & Side Job",
  "Investment & Dividend",
  "Allowance & Gift",
  "Debt Repayment",
  "Bonus & Commission",
  "Rental Income",
  "Refund & Cashback",
  "Other Income",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drinks": "#EF4444",
  Transportation: "#0284C7",
  Transportaion: "#0284C7",
  Bills: "#F59E0B",
  Groceries: "#10B981",
  "Hobby & Entertainment": "#8B5CF6",
  "Health & Personal Care": "#14B8A6",
  Shopping: "#6366F1",
  Education: "#3B82F6",
  "Family Needs": "#EC4899",
  "Gift and Charity": "#F43F5E",
  Traveling: "#84CC16",
  Sports: "#06B6D4",
  Loans: "#E11D48",
  "Lending & Receivables": "#D97706",
  "Saving & Investment": "#059669",
  Debt: "#DC2626",
  Other: "#64748B",

  Salary: "#10B981",
  "Business & Profit": "#3B82F6",
  "Freelance & Side Job": "#8B5CF6",
  "Investment & Dividend": "#059669",
  "Allowance & Gift": "#F59E0B",
  "Debt Repayment": "#14B8A6",
  "Bonus & Commission": "#F97316",
  "Rental Income": "#6366F1",
  "Refund & Cashback": "#06B6D4",
  "Other Income": "#64748B",
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || "#64748B";
};
