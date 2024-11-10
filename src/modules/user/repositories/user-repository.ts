import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users } from "../../../db/schema/user.schema";
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRole,
} from "../types/user-types";
import logger from "../../../common/utils/logger";
import { ApiError } from "../../../common/errors/api-error";

export class UserRepository {
  public async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || "customer",
        })
        .returning();

      if (!user) {
        throw new ApiError(500, "Failed to create user");
      }

      return this.mapToUser(user);
    } catch (error) {
      logger.error("Repository error creating user:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to create user");
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      return user ? this.mapToUser(user) : null;
    } catch (error) {
      logger.error("Repository error finding user:", error);
      return null;
    }
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return this.mapToUser(user);
    } catch (error) {
      logger.error("Repository error updating user:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update user");
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await db.query.users.findMany();
      return allUsers.map((user) => this.mapToUser(user));
    } catch (error) {
      logger.error("Repository error getting all users:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to get users");
    }
  }

  public async getSuppliers(): Promise<User[]> {
    try {
      const suppliers = await db.query.users.findMany({
        where: eq(users.role, "supplier"),
      });
      return suppliers.map((user) => this.mapToUser(user));
    } catch (error) {
      logger.error("Repository error getting suppliers:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to get suppliers");
    }
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
