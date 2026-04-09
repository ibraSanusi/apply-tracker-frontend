import { api } from "./api";

export const authService = {
  login: (email: string, password: string): Promise<any> => 
    api("/users/login", { body: { email, password } }),
    
  register: (data: any): Promise<any> => 
    api("/users/register", { body: data }),
    
  verifyEmail: (token: string, userId: string): Promise<any> => 
    api("/users/verify-email", { body: { token, userId } }),
};
