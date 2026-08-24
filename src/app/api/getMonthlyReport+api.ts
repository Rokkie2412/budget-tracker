import connectDB from "@/lib/connectDataBase";
import { hashUserId } from "@/lib/hashUserId";
import { verifyAuth } from "@/lib/jwtToken";
import { Transaction } from "@/models";
import type {
  MonthlyReportItem,
  MonthlyReportPaginationMeta,
  MonthlyReportResponse,
} from "@/types";

interface MonthlyAggregationRaw {
  _id: {
    year: number;
    month: number;
  };
  income: number;
  expense: number;
}

interface AggregationFacetResult {
  data: MonthlyAggregationRaw[];
  totalCount: { count: number }[];
}

const handleGetMonthlyReport = async (
  userId: string,
  startDateInput?: string,
  endDateInput?: string,
  pageInput = 1,
  limitInput = 12,
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
  const page = Math.max(1, Number(pageInput) || 1);
  const limit = Math.max(1, Math.min(100, Number(limitInput) || 12));
  const skip = (page - 1) * limit;

  let startMonthDate: Date | undefined = undefined;
  let endMonthDate: Date | undefined = undefined;

  if (startDateInput) {
    const startMonth = new Date(startDateInput);
    if (isNaN(startMonth.getTime())) {
      return Response.json(
        { message: "Invalid start date provided." },
        { status: 400 },
      );
    }
    startMonthDate = new Date(
      startMonth.getFullYear(),
      startMonth.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
  }

  if (endDateInput) {
    const endMonth = new Date(endDateInput);
    if (isNaN(endMonth.getTime())) {
      return Response.json(
        { message: "Invalid end date provided." },
        { status: 400 },
      );
    }
    endMonthDate = new Date(
      endMonth.getFullYear(),
      endMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
  }

  const matchFilter: Record<string, unknown> = {
    userId: hashedUserId,
  };

  if (startMonthDate && endMonthDate) {
    const [rangeStart, rangeEnd] =
      startMonthDate <= endMonthDate
        ? [startMonthDate, endMonthDate]
        : [endMonthDate, startMonthDate];
    matchFilter.date = { $gte: rangeStart, $lte: rangeEnd };
  } else if (startMonthDate) {
    matchFilter.date = { $gte: startMonthDate };
  } else if (endMonthDate) {
    matchFilter.date = { $lte: endMonthDate };
  }

  const [aggregateResult]: AggregationFacetResult[] =
    await Transaction.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "IN"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "OUT"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

  const rawList = aggregateResult?.data ?? [];
  const totalMonths = aggregateResult?.totalCount?.[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalMonths / limit));

  const reports: MonthlyReportItem[] = rawList.map(
    (item: MonthlyAggregationRaw): MonthlyReportItem => ({
      date: new Date(
        Date.UTC(item._id.year, item._id.month - 1, 1),
      ).toISOString(),
      income: item.income,
      expense: item.expense,
      total: item.income - item.expense,
    }),
  );

  const pagination: MonthlyReportPaginationMeta = {
    page,
    limit,
    totalMonths,
    totalPages,
  };

  const responseBody: MonthlyReportResponse = {
    message: "Success retrieving monthly report.",
    data: {
      reports,
      pagination,
    },
  };

  return Response.json(responseBody);
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
    const startDateMonth = searchParams.get("startMonth") ?? undefined;
    const endDateMonth = searchParams.get("endMonth") ?? undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;

    if (payload.userId !== userId) {
      return Response.json(
        { message: "Unauthorized: You don't have access to this data." },
        { status: 403 },
      );
    }

    return await handleGetMonthlyReport(
      userId,
      startDateMonth,
      endDateMonth,
      page,
      limit,
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "An error occurred on the server.", error: errorMessage },
      { status: 500 },
    );
  }
};
