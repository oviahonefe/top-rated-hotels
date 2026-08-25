export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileImageUrl: string | null;
  createdAt: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};