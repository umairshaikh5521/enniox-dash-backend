import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";
import logger from "../common/utils/logger";

async function runMigrations() {
  logger.info("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    logger.info("Migrations completed successfully");
  } catch (error) {
    logger.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();
