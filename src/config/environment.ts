import dotenv from "dotenv";
import { join } from "path";

// Load .env file
dotenv.config({ path: join(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

export const environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  DATABASE_URL: process.env.DATABASE_URL,
} as const;
