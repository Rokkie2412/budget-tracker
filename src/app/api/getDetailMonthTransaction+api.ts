import connectDataBase from "@/lib/connectDataBase";
import { hashUserId } from "@/lib/hashUserId";
import { verifyAuth } from "@/lib/jwtToken";
import { Transaction } from "@/models";

interface RequestBody {
  userId: string;
  date?: string | Date;
}

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

const handleMonthlyDetail = async (
  userId: string,
  dateInput?: string | Date,
): Promise<Response> => {
  const trimmedId = userId?.trim();
  if (
    !trimmedId ||
    trimmedId === "null" ||
    trimmedId === "undefined" ||
    typeof trimmedId !== "string"
  ) {
    return Response.json(
      { message: "Valid userId is required." },
      { status: 400 },
    );
  }

  const hashedUserId = hashUserId(trimmedId);

  const targetDate = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(targetDate.getTime())) {
    return Response.json({ message: "Invalid date format." }, { status: 400 });
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0-indexed

  // Current selected month range (1st day 00:00:00 to last day 23:59:59.999)
  const startCurrentMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endCurrentMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // Previous month range
  const startPreviousMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endPreviousMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Parallel fetch for current and previous month summaries + current month transactions list
  const [currentMonth, lastMonth, transactions] = await Promise.all([
    getSummaryForRange(hashedUserId, startCurrentMonth, endCurrentMonth),
    getSummaryForRange(hashedUserId, startPreviousMonth, endPreviousMonth),
    Transaction.find({
      userId: hashedUserId,
      date: { $gte: startCurrentMonth, $lte: endCurrentMonth },
    })
      .sort({ date: -1 })
      .lean(),
  ]);

  // Calculate percentage difference comparing to last month if available
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
    message: "Success retrieving monthly transaction detail.",
    data: {
      year,
      month: month + 1,
      total: currentMonth.total,
      income: currentMonth.incoming,
      outcome: currentMonth.outgoing,
      transactions,
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

export const POST = async (request: Request): Promise<Response> => {
  try {
    await connectDataBase();
    const body: RequestBody = await request.json();
    return await handleMonthlyDetail(body.userId, body.date);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "An error occurred on the server.", error: errorMessage },
      { status: 500 },
    );
  }
};

export const GET = async (request: Request): Promise<Response> => {
  try {
    const { payload, errorResponse } = await verifyAuth(request);

    if (errorResponse || !payload) {
      return errorResponse!;
    }

    await connectDataBase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? "";
    const date = searchParams.get("date") ?? undefined;

    if (payload.userId !== userId) {
      return Response.json(
        { message: "Unauthorized: You don't have access to this data." },
        { status: 403 },
      );
    }

    return await handleMonthlyDetail(userId, date);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "An error occurred on the server.", error: errorMessage },
      { status: 500 },
    );
  }
};
