"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("downforge_auth");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data && typeof data === "object" && data.loggedIn) {
          setIsLoggedIn(true);
        }
      } catch { /* ignore */ }
    }
  }, []);

  const login = useCallback((email: string) => {
    localStorage.setItem("downforge_auth", JSON.stringify({ loggedIn: true, email }));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("downforge_auth");
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
