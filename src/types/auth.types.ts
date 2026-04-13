export interface User {
  id: string | number;
  name: string;
  email: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  data: User;
}

export interface VerifyEmailRequest {
  token: string;
  userId: string;
}
