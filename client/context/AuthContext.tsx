import React, { createContext, useContext, useState, useEffect } from "react";

export type AccountType = "standard" | "professional" | "pharmacist";

interface User {
  email: string;
  type: AccountType;
  phone?: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, type: AccountType, phone?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("takymed_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, type: AccountType, phone?: string) => {
    const newUser = { email, type, phone, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem("takymed_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("takymed_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
