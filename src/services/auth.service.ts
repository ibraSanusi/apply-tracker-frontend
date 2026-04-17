import { api } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  RecoverPasswordRequest
} from "../types/auth.types";


export const authService = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api("/users/login", { body: { email, password } as LoginRequest }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api("/users/register", { body: data }),

  verifyEmail: (token: string, userId: string): Promise<any> =>
    api("/users/verify-email", { body: { token, userId } as VerifyEmailRequest }),

  recoverPassword: (data: RecoverPasswordRequest): Promise<{ message: string }> =>
    api("/users/confirm-password", { body: data }),

  sendRecoveryEmail: (email: string): Promise<{ message: string }> =>
    api("/users/send-recovery-mail", { body: { email } }),
};

