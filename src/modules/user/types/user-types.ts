export enum UserRole {
  ADMIN = "admin",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UpdateUserDto = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt" | "role">
>;

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
