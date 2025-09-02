import { createContext, useContext, useEffect, useState } from "react";
import apiService from "@/lib/api";

export type UserRole = "student" | "industry_expert";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  profileData?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: Error; data?: any }>;
  signUp: (...args: any[]) => Promise<any>; // will define better later
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("authUser");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await apiService.login({ email, password });
      const token = res.data?.token;
      const user = res.data?.user;
      if (!token || !user) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      setUser(user);
      return { data: user };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    fullName: string
  ) => {
    try {
      const res = await apiService.register({
        email,
        password,
        role,
        fullName,
      });
      const token = res.data?.token;
      const user = res.data?.user;
      if (!token || !user) {
        throw new Error("Invalid signup response");
      }
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      setUser(user);
      return { data: user };
    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
