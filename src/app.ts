import dotenv from "dotenv";
// Load environment variables before other imports
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./modules/user/routes/user-routes";
import { healthRouter } from "./modules/health/routes/health-routes";
import logger from "./common/utils/logger";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
});

// Routes
app.use("/api/users", userRouter);
app.use("/api", healthRouter);

// Error handling middleware
interface ApiError extends Error {
  statusCode?: number;
}

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
