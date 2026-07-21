"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "downforge_auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  plan: "free" | "pro";
  plan_expires_at: string | null;
  notifications: {
    email_completed: boolean;
    weekly_summary: boolean;
    product_updates: boolean;
    billing_reminders: boolean;
  } | null;
  created_at: string | null;
}

interface StoredSession {
  token: string;
  user: AuthUser;
}

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => {},
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
});

function readStored(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.token && parsed.user) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function writeStored(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      return { ok: false, status: res.status, error: json?.error?.message || `HTTP ${res.status}` };
    }
    return { ok: true, status: res.status, data: json.data as T };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "Network error" };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token is present, validate it by fetching /me.
  useEffect(() => {
    let cancelled = false;
    const stored = readStored();
    if (!stored) {
      setLoading(false);
      return;
    }

    setToken(stored.token);
    setUserState(stored.user);

    apiCall<{ user: AuthUser }>("/api/proxy/auth/me", {
      headers: { Authorization: `Bearer ${stored.token}` },
    }).then((result) => {
      if (cancelled) return;
      if (result.ok && result.data?.user) {
        setUserState(result.data.user);
        writeStored({ token: stored.token, user: result.data.user });
      } else if (result.status === 401) {
        // Token expired/invalid — clear and let the user log in again.
        writeStored(null);
        setToken(null);
        setUserState(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u && token) writeStored({ token, user: u });
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiCall<{ token: string; user: AuthUser }>(
      "/api/proxy/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    if (!result.ok || !result.data) {
      return { success: false, error: result.error };
    }
    const { token: newToken, user: newUser } = result.data;
    writeStored({ token: newToken, user: newUser });
    setToken(newToken);
    setUserState(newUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    const result = await apiCall<{ token: string; user: AuthUser }>(
      "/api/proxy/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    if (!result.ok || !result.data) {
      return { success: false, error: result.error };
    }
    const { token: newToken, user: newUser } = result.data;
    writeStored({ token: newToken, user: newUser });
    setToken(newToken);
    setUserState(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      // Best-effort; ignore failures so the client always clears state.
      await apiCall("/api/proxy/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    writeStored(null);
    setToken(null);
    setUserState(null);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
