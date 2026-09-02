export const formattedTotal = (total: number): string => {
  if (total === 0) return `Rp ${total.toLocaleString("id-ID")}`;

  return total > 0
    ? `+Rp ${total.toLocaleString("id-ID")}`
    : `-Rp ${Math.abs(total).toLocaleString("id-ID")}`;
};

export const totalTextColor = (total: number): string =>
  total > 0 ? "text-[#007A55]" : total < 0 ? "text-[#DC2626]" : "text-[#1E293B]";
