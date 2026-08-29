import connectDB from "@/lib/connectDataBase";
import { hashUserId } from "@/lib/hashUserId";
import { verifyAuth } from "@/lib/jwtToken";
import { Transaction } from "@/models";

export const POST = async (request: Request): Promise<Response> => {
  try {
    const { payload, errorResponse } = await verifyAuth(request);

    if (errorResponse || !payload) {
      return errorResponse!;
    }

    await connectDB();
    const { type, amount, category, description, date, userId } = await request.json();

    if (!type || !amount || !category || !description || !date || !userId) {
      return Response.json({ message: "Missing transaction data" }, { status: 400 });
    }

    if (payload.userId !== userId) {
      return Response.json({ message: "Unauthorized: user do not have access." }, { status: 403 });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Response.json({ message: "Amount must be a positive number" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return Response.json({ message: "Invalid date format" }, { status: 400 });
    }

    const hashedUserId = hashUserId(userId.trim());

    const transaction = new Transaction({
      type,
      amount: numericAmount,
      category,
      description: description.trim(),
      date: parsedDate,
      userId: hashedUserId,
    });

    const savedTransaction = await transaction.save();

    return Response.json(
      {
        message: "Transaction added successfully",
        data: savedTransaction,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "Failed to add transaction", error: errorMessage },
      { status: 500 },
    );
  }
};
