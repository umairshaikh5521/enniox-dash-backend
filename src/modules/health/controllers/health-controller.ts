import { Request, Response } from "express";
import { db } from "../../../db";
import logger from "../../../common/utils/logger";

export class HealthController {
  public async check(req: Request, res: Response): Promise<void> {
    try {
      // Check database connection
      await db.query.users.findFirst();

      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          api: "running",
        },
      });
    } catch (error) {
      logger.error("Health check failed:", error);
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "disconnected",
          api: "running",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
