import { api } from "./api";
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  VerifyEmailRequest 
} from "../types/auth.types";

export const authService = {
  login: (email: string, password: string): Promise<AuthResponse> => 
    api("/users/login", { body: { email, password } as LoginRequest }),
    
  register: (data: RegisterRequest): Promise<AuthResponse> => 
    api("/users/register", { body: data }),
    
  verifyEmail: (token: string, userId: string): Promise<any> => 
    api("/users/verify-email", { body: { token, userId } as VerifyEmailRequest }),
};
