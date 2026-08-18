import connectDataBase from "@/lib/connectDataBase";
import { hashUserId } from "@/lib/hashUserId";
import { verifyAuth } from "@/lib/jwtToken";
import { Transaction } from "@/models";

const handleGetTransactions = async (
  userId: string,
  dateInput?: string | Date,
  startDateInput?: string | Date,
  endDateInput?: string | Date,
  pageInput = 1,
  limitInput = 10,
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
  const limit = Math.max(1, Math.min(100, Number(limitInput) || 10));
  const skip = (page - 1) * limit;

  let rangeStart: Date;
  let rangeEnd: Date;

  if (startDateInput && endDateInput) {
    rangeStart = new Date(startDateInput);
    rangeEnd = new Date(endDateInput);
  } else {
    const targetDate = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(targetDate.getTime())) {
      return Response.json(
        { message: "Invalid date format." },
        { status: 400 },
      );
    }
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    rangeStart = new Date(year, month, 1, 0, 0, 0, 0);
    rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
  }

  const transactionFilter = {
    userId: hashedUserId,
    date: { $gte: rangeStart, $lte: rangeEnd },
  };

  const [totalTransactions, transactions] = await Promise.all([
    Transaction.countDocuments(transactionFilter),
    Transaction.find(transactionFilter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalTransactions / limit);

  const formattedTransactions = transactions.map(
    ({ _id, amount, description, date, type, category }) => ({
      _id: _id.toString(),
      amount,
      description: description,
      date: date.toISOString(),
      type,
      category,
    }),
  );

  return Response.json({
    message: "Success retrieving paginated transactions.",
    data: {
      transactions: formattedTransactions,
      pagination: {
        page,
        limit,
        totalTransactions,
        totalPages,
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

    await connectDataBase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? "";
    const date = searchParams.get("date") ?? undefined;
    const startDate = searchParams.get("startDate") ?? undefined;
    const endDate = searchParams.get("endDate") ?? undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    if (payload.userId !== userId) {
      return Response.json(
        { message: "Unauthorized: You don't have access to this data." },
        { status: 403 },
      );
    }

    return await handleGetTransactions(
      userId,
      date,
      startDate,
      endDate,
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
