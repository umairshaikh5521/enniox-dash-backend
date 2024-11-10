import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import { CreateUserDto, LoginDto, UpdateUserDto } from "../types/user-types";
import { ApiError } from "../../../common/errors/api-error";
import logger from "../../../common/utils/logger";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async register(
    req: Request<{}, {}, CreateUserDto>,
    res: Response
  ): Promise<void> {
    try {
      logger.info("Registering user:", { email: req.body.email });
      const authResponse = await this.userService.registerUser(req.body);
      res.status(201).json(authResponse);
    } catch (error) {
      logger.error("Error in register controller:", error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  public async login(
    req: Request<{}, {}, LoginDto>,
    res: Response
  ): Promise<void> {
    try {
      const authResponse = await this.userService.loginUser(req.body);
      res.status(200).json(authResponse);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async updateProfile(
    req: Request<{}, {}, UpdateUserDto>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const updatedUser = await this.userService.updateUser(userId, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await this.userService.getSuppliers();
      res.status(200).json(suppliers);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
