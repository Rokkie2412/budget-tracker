import mongoose, { Mongoose } from "mongoose";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const getMongoUri = (): string => {
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV;

  if (!uri) {
    throw new Error(
      "Database URI is not defined in environment variables (MONGO_URI_DEV / MONGO_URI_PROD / MONGODB_URI).",
    );
  }

  return uri;
};

let cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export const connectDataBase = async (): Promise<Mongoose> => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState !== 1) {
    const uri = getMongoUri();

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      } as mongoose.ConnectOptions)
      .then((m: Mongoose): Mongoose => {
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
};

export default connectDataBase;
