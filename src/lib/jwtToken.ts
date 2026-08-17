import { jwtVerify } from "jose";

export interface AuthPayload {
  userId: string;
}

export const getJwtSecretKey = (): Uint8Array => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) throw new Error("ENCRYPTION_KEY is not defined");

  return new TextEncoder().encode(secret);
};

export const verifyAuth = async (
  request: Request,
): Promise<{ payload: AuthPayload | null; errorResponse: Response | null }> => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      payload: null,
      errorResponse: Response.json(
        { message: "Unauthorized: Missing or invalid Bearer token." },
        { status: 401 },
      ),
    };
  }

  const token = authHeader.substring(7); // Ambil token setelah "Bearer "

  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);

    return {
      payload: payload as unknown as AuthPayload,
      errorResponse: null,
    };
  } catch {
    return {
      payload: null,
      errorResponse: Response.json(
        { message: "Unauthorized: Token is invalid or expired." },
        { status: 401 },
      ),
    };
  }
};
