// src/context/AuthContext.tsx
import { createContext, useContext } from "react";
import type { LoginDto, RegisterDto, User } from "../types/user";
import { useGetAuth } from "../hooks/get/useGetAuth";
import { usePostAuth } from "../hooks/post/usePostAuth";

interface AuthContextType {
  authUser: User | null | undefined;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<User>;
  register: (data: RegisterDto) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: authUser, isLoading } = useGetAuth();
  const { login, register, logout } = usePostAuth();

  return (
    <AuthContext.Provider
      value={{ authUser, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
