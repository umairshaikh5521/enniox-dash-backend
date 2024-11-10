import jwt from "jsonwebtoken";
import { environment } from "../../../config/environment";
import { UserRepository } from "../repositories/user-repository";
import { PasswordUtils } from "../utils/password-utils";
import {
  AuthResponse,
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  User,
  UserRole,
} from "../types/user-types";
import { ApiError } from "../../../common/errors/api-error";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async registerUser(userData: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findUserByEmail(
      userData.email
    );
    if (existingUser) {
      throw ApiError.badRequest("User already exists");
    }

    const hashedPassword = await PasswordUtils.hashPassword(userData.password);
    const user = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.CUSTOMER,
    });

    const token = this.generateToken(user.id, user.role);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  public async loginUser(loginData: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findUserByEmail(loginData.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await PasswordUtils.comparePassword(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = this.generateToken(user.id, user.role);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  public async updateUser(
    userId: string,
    userData: UpdateUserDto
  ): Promise<Omit<User, "password">> {
    if (userData.password) {
      userData.password = await PasswordUtils.hashPassword(userData.password);
    }

    const updatedUser = await this.userRepository.updateUser(userId, userData);
    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  public async getAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map(({ password, ...user }) => user);
  }

  public async getSuppliers(): Promise<Omit<User, "password">[]> {
    const suppliers = await this.userRepository.getSuppliers();
    return suppliers.map(({ password, ...user }) => user);
  }

  private generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, environment.JWT_SECRET, {
      expiresIn: environment.JWT_EXPIRES_IN,
    });
  }
}
