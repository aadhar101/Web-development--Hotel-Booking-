"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "../lib/actions/auth-action";

export interface AuthUser {
  _id: string; firstName: string; lastName: string; email: string;
  role: "guest" | "admin" | "super_admin"; avatar?: string; phone?: string;
  isEmailVerified: boolean; isActive: boolean;
}
interface AuthContextType {
  user: AuthUser | null; isLoading: boolean; isAuthenticated: boolean;
  isAdmin: boolean; isSuperAdmin: boolean;
  logout: () => Promise<void>; setUser: (user: AuthUser | null) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readUserCookie(): AuthUser | null {
  try {
    const match = document.cookie.split("; ").find((r) => r.startsWith("user="));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setUser(readUserCookie()); setIsLoading(false); }, []);

  const logout = async () => { await handleLogout(); setUser(null); router.replace("/login"); };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, isAdmin: user?.role === "admin" || user?.role === "super_admin", isSuperAdmin: user?.role === "super_admin", logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}