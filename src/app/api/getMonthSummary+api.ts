import connectDB from "@/lib/connectDataBase";
import { hashUserId } from "@/lib/hashUserId";
import { verifyAuth } from "@/lib/jwtToken";
import { Transaction } from "@/models";
import type {
  CategoryBreakdown,
  CategoryBreakdownItem,
  ExpenseCategory,
  IncomeCategory,
} from "@/types";

interface MonthlyAggregationResult {
  _id: "IN" | "OUT";
  total: number;
  count: number;
}

interface SummaryData {
  incoming: number;
  outgoing: number;
  total: number;
}

const getSummaryForRange = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<SummaryData> => {
  const results: MonthlyAggregationResult[] = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let incoming = 0;
  let outgoing = 0;

  for (const item of results) {
    if (item._id === "IN") {
      incoming = item.total;
    } else if (item._id === "OUT") {
      outgoing = item.total;
    }
  }

  return {
    incoming,
    outgoing,
    total: incoming - outgoing,
  };
};

interface CategoryAggregationRaw {
  _id: {
    type: "IN" | "OUT";
    category: string;
  };
  total: number;
  count: number;
}

const getCategoryBreakdown = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  incomingTotal: number,
  outgoingTotal: number,
): Promise<CategoryBreakdown> => {
  const results: CategoryAggregationRaw[] = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          category: { $ifNull: ["$category", "Other"] },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  const expenses: CategoryBreakdownItem<ExpenseCategory>[] = [];
  const income: CategoryBreakdownItem<IncomeCategory>[] = [];

  for (const item of results) {
    const rawCategory = item._id.category || "Other";
    const total = item.total;
    const count = item.count;

    if (item._id.type === "OUT") {
      const percentage =
        outgoingTotal > 0 ? parseFloat(((total / outgoingTotal) * 100).toFixed(1)) : 0;
      expenses.push({
        category: rawCategory as ExpenseCategory,
        total,
        percentage,
        percentageFormatted: `${percentage}%`,
        count,
      });
    } else if (item._id.type === "IN") {
      const percentage =
        incomingTotal > 0 ? parseFloat(((total / incomingTotal) * 100).toFixed(1)) : 0;
      income.push({
        category: rawCategory as IncomeCategory,
        total,
        percentage,
        percentageFormatted: `${percentage}%`,
        count,
      });
    }
  }

  return {
    expenses,
    income,
  };
};

const handleMonthSummary = async (userId: string, dateInput?: string | Date): Promise<Response> => {
  const trimmedId = userId?.trim();
  if (
    !trimmedId ||
    trimmedId === "null" ||
    trimmedId === "undefined" ||
    typeof trimmedId !== "string"
  ) {
    return Response.json({ message: "Valid userId is required." }, { status: 400 });
  }

  const hashedUserId = hashUserId(trimmedId);

  const targetDate = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(targetDate.getTime())) {
    return Response.json({ message: "Invalid date format." }, { status: 400 });
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0-indexed

  // Current selected month range
  const startCurrentMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endCurrentMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // Previous month range
  const startPreviousMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endPreviousMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Parallel fetch for current and previous month summaries
  const [currentMonth, lastMonth] = await Promise.all([
    getSummaryForRange(hashedUserId, startCurrentMonth, endCurrentMonth),
    getSummaryForRange(hashedUserId, startPreviousMonth, endPreviousMonth),
  ]);

  // Category breakdown for current month
  const categories = await getCategoryBreakdown(
    hashedUserId,
    startCurrentMonth,
    endCurrentMonth,
    currentMonth.incoming,
    currentMonth.outgoing,
  );

  // Calculate percentage difference comparing to last month
  let percentageChange: string | null = null;
  let status: "plus" | "minus" | null = null;

  if (lastMonth.total !== 0) {
    const diff = currentMonth.total - lastMonth.total;
    const percent = Math.abs((diff / lastMonth.total) * 100);
    percentageChange = `${percent.toFixed(1)}%`;
    status = diff >= 0 ? "plus" : "minus";
  } else if (currentMonth.total !== 0) {
    percentageChange = "100%";
    status = currentMonth.total > 0 ? "plus" : "minus";
  }

  return Response.json({
    message: "Success retrieving monthly summary.",
    data: {
      year,
      month: month + 1,
      total: currentMonth.total,
      income: currentMonth.incoming,
      outcome: currentMonth.outgoing,
      categories,
      lastMonth: {
        total: lastMonth.total,
        income: lastMonth.incoming,
        outcome: lastMonth.outgoing,
      },
      comparison: {
        percentage: percentageChange,
        status,
      },
    },
  });
};

export const GET = async (request: Request): Promise<Response> => {
  try {
    const { payload, errorResponse } = await verifyAuth(request);

    if (errorResponse || !payload) {
      return errorResponse!;
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? "";
    const date = searchParams.get("date") ?? undefined;

    if (payload.userId !== userId) {
      return Response.json(
        { message: "Unauthorized: You don't have access to this data." },
        { status: 403 },
      );
    }

    return await handleMonthSummary(userId, date);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "An error occurred on the server.", error: errorMessage },
      { status: 500 },
    );
  }
};
