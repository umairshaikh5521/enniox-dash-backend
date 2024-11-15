import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT!) || 5432,
      ssl: {
      rejectUnauthorized: false  // Only use for development!
    }
  },
  verbose: true,
  strict: true,
} satisfies Config;
