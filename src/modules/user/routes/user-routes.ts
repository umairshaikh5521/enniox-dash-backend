import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";
import { UserRole } from "../types/user-types";
import {
  registerValidation,
  loginValidation,
  updateValidation,
} from "../middlewares/validation-middleware";
import { CreateUserDto, LoginDto, UpdateUserDto } from "../types/user-types";

export const userRouter = Router();
const userController = new UserController();

// Public routes
userRouter.post(
  "/register",
  registerValidation,
  (req: Request<{}, {}, CreateUserDto>, res: Response) =>
    userController.register(req, res)
);

userRouter.post(
  "/login",
  loginValidation,
  (req: Request<{}, {}, LoginDto>, res: Response) =>
    userController.login(req, res)
);

// Protected routes
userRouter.put(
  "/profile",
  AuthMiddleware.authenticate,
  updateValidation,
  (req: Request<{}, {}, UpdateUserDto>, res: Response) =>
    userController.updateProfile(req, res)
);

// Admin only routes
userRouter.get(
  "/users",
  AuthMiddleware.authenticate,
  RoleMiddleware.authorize(UserRole.ADMIN),
  (req: Request, res: Response) => userController.getAllUsers(req, res)
);

// Admin and Supplier routes
userRouter.get(
  "/suppliers",
  AuthMiddleware.authenticate,
  RoleMiddleware.authorize(UserRole.ADMIN, UserRole.SUPPLIER),
  (req: Request, res: Response) => userController.getSuppliers(req, res)
);
