import { supabase } from "../../../config/database";
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRole,
} from "../types/user-types";
import logger from "../../../common/utils/logger";
import { ApiError } from "../../../common/errors/api-error";

export class UserRepository {
  private static readonly TABLE_NAME = "users";

  private transformToSnakeCase(data: any) {
    return {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
    };
  }

  private transformToCamelCase(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const { data, error } = await supabase
        .from(UserRepository.TABLE_NAME)
        .insert([this.transformToSnakeCase(userData)])
        .select()
        .single();

      if (error) {
        logger.error("Error creating user:", error);
        throw new ApiError(400, error.message);
      }

      if (!data) {
        throw new ApiError(500, "Failed to create user");
      }

      return this.transformToCamelCase(data);
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
      const { data, error } = await supabase
        .from(UserRepository.TABLE_NAME)
        .select()
        .eq("email", email)
        .single();

      if (error) {
        logger.error("Error finding user by email:", error);
        return null;
      }

      return data ? this.transformToCamelCase(data) : null;
    } catch (error) {
      logger.error("Repository error finding user:", error);
      return null;
    }
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const { data, error } = await supabase
        .from(UserRepository.TABLE_NAME)
        .update(this.transformToSnakeCase(userData))
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Error updating user:", error);
        throw new ApiError(400, error.message);
      }

      if (!data) {
        throw new ApiError(404, "User not found");
      }

      return this.transformToCamelCase(data);
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
      const { data, error } = await supabase
        .from(UserRepository.TABLE_NAME)
        .select("*");

      if (error) {
        logger.error("Error getting all users:", error);
        throw new ApiError(400, error.message);
      }

      return data.map((user) => this.transformToCamelCase(user));
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
      const { data, error } = await supabase
        .from(UserRepository.TABLE_NAME)
        .select("*")
        .eq("role", UserRole.SUPPLIER);

      if (error) {
        logger.error("Error getting suppliers:", error);
        throw new ApiError(400, error.message);
      }

      return data.map((user) => this.transformToCamelCase(user));
    } catch (error) {
      logger.error("Repository error getting suppliers:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to get suppliers");
    }
  }
}
