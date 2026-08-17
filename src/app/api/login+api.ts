import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

import connectDataBase from "@/lib/connectDataBase";
import UserConnected from "@/models/connectedUser";
import { IUserConnected } from "@/types";

const getJwtSecretKey = (): Uint8Array => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) throw new Error("ENCRYPTION_KEY is not defined");

  return new TextEncoder().encode(secret);
};

export const POST = async (request: Request): Promise<Response> => {
  try {
    await connectDataBase();

    const body: IUserConnected = await request.json();
    const { userId, password } = body;

    if (
      !userId ||
      typeof userId !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return Response.json(
        { message: "userId and password are required." },
        { status: 400 },
      );
    }

    const user: IUserConnected | null = await UserConnected.findOne({
      userId: userId.trim(),
    });

    if (!user) {
      return Response.json({ message: "User not found." }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid password." }, { status: 401 });
    }

    const secretKey = getJwtSecretKey();
    const token = await new SignJWT({ userId: user.userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(secretKey);

    return Response.json({
      message: "Login successfully.",
      token,
      user: {
        userId: user.userId,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { message: "An error occurred on the server.", error: errorMessage },
      { status: 500 },
    );
  }
};
