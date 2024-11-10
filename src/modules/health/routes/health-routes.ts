import { Router } from "express";
import { HealthController } from "../controllers/health-controller";

export const healthRouter = Router();
const healthController = new HealthController();

healthRouter.get("/health-check", (req, res) =>
  healthController.check(req, res)
);
