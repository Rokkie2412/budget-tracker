import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { ENC_ALGORITHM } from "@/constants";

const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY is not defined");
  }

  const keyBuffer = Buffer.from(key, "utf8");
  if (keyBuffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes for AES-256");
  }

  return keyBuffer;
};

export const hashUserId = (userId: string): string => {
  return bcrypt.hashSync(userId, process.env.STATIC_SALT);
};

export const compareUserId = (rawId: string, hashedId: string): boolean => {
  return bcrypt.compareSync(rawId, hashedId);
};

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENC_ALGORITHM, getEncryptionKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  try {
    const [ivHex, encryptedText] = text.split(":");
    if (
      !ivHex ||
      !encryptedText ||
      !/^[\da-f]{32}$/i.test(ivHex) ||
      !/^(?:[\da-f]{32})+$/i.test(encryptedText)
    ) {
      return text;
    }

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ENC_ALGORITHM, getEncryptionKey(), iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return "[Data Protected]";
  }
};
