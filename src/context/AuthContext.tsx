import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

interface User {
  id: number;
  name: string;
  email: string;
  lastName: string;
  isVerified: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("userData") || "{}"),
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
  }, [token, user]);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
