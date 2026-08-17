import bcrypt from "bcryptjs";

export const hashUserId = (userId: string): string => {
  const salt = process.env.STATIC_SALT || '$2a$10$V2sL5gN8jQ8rT1pV1cX3yC';
  if (!salt) {
    throw new Error("STATIC_SALT is not defined in environment variables");
  }

  const trimmed = userId.trim();

  // If already hashed (e.g. starts with $2a$ or $2b$), return as-is
  if (trimmed.startsWith("$2a$") || trimmed.startsWith("$2b$")) {
    return trimmed;
  }

  return bcrypt.hashSync(trimmed, salt);
};
