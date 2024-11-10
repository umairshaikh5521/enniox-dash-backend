import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user-types";
import { ApiError } from "../../../common/errors/api-error";

export class RoleMiddleware {
  public static authorize(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const userRole = req.userRole;

        if (!userRole) {
          throw ApiError.unauthorized("Role not found in token");
        }

        if (!allowedRoles.includes(userRole)) {
          throw ApiError.forbidden(
            "You do not have permission to access this resource"
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
