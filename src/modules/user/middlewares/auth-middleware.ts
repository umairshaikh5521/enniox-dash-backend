import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../../../config/environment";
import { JwtPayload, UserRole } from "../types/user-types";
import { ApiError } from "../../../common/errors/api-error";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
    }
  }
}

export class AuthMiddleware {
  public static authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        throw ApiError.unauthorized("No token provided");
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, environment.JWT_SECRET) as JwtPayload;

      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      next(ApiError.unauthorized("Invalid token"));
    }
  }
}
