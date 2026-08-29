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
  avatar_url?: string | null;
  provider?: "local" | "google" | "both" | null;
  google_id?: string | null;
  has_password?: boolean | null;
  email_verified?: boolean | null;
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

type AuthResult = { success: boolean; error?: string; code?: string };

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  googleLogin: (id_token: string) => Promise<AuthResult>;
  verifyEmail: (email: string, code: string) => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthResult>;
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
  googleLogin: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  resendVerification: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
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
): Promise<{ ok: boolean; status: number; data?: T; error?: string; code?: string }> {
  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      return {
        ok: false,
        status: res.status,
        error: json?.error?.message || `HTTP ${res.status}`,
        code: json?.error?.code,
      };
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

    // Safety fallback: never leave loading stuck if network hangs
    const safetyId = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 6000);

    // Race the auth check against a timeout so a hung backend doesn't freeze the app
    const timeoutPromise = new Promise<{ ok: boolean; status: number; error?: string }>((resolve) =>
      setTimeout(() => resolve({ ok: false, status: 0, error: "Auth check timeout" }), 5000),
    );

    Promise.race([
      apiCall<{ user: AuthUser }>("/api/proxy/auth/me", {
        headers: { Authorization: `Bearer ${stored.token}` },
      }),
      timeoutPromise,
    ])
      .then((result) => {
        if (cancelled) return;
        if (result.ok && (result as any).data?.user) {
          setUserState((result as any).data.user);
          writeStored({ token: stored.token, user: (result as any).data.user });
        } else if (result.status === 401) {
          // Token expired/invalid — clear and let the user log in again.
          writeStored(null);
          setToken(null);
          setUserState(null);
        } else if (result.status === 0) {
          // Network/timeout: keep optimistic session so dashboard can still render
          // but don't block loading forever
        }
      })
      .catch(() => {
        // Swallow network errors — keep optimistic session
      })
      .finally(() => {
        if (!cancelled) {
          clearTimeout(safetyId);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(safetyId);
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
      return { success: false, error: result.error, code: result.code };
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
      return { success: false, error: result.error, code: result.code };
    }
    const { token: newToken, user: newUser } = result.data;
    writeStored({ token: newToken, user: newUser });
    setToken(newToken);
    setUserState(newUser);
    return { success: true };
  }, []);

  const googleLogin = useCallback(async (id_token: string) => {
    const result = await apiCall<{ token: string; user: AuthUser }>(
      "/api/proxy/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ id_token }),
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

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const result = await apiCall<{ message: string }>("/api/proxy/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    if (!result.ok) return { success: false, error: result.error, code: result.code };
    return { success: true };
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const result = await apiCall<{ message: string }>("/api/proxy/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!result.ok) return { success: false, error: result.error, code: result.code };
    return { success: true };
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const result = await apiCall<{ message: string }>("/api/proxy/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!result.ok) return { success: false, error: result.error, code: result.code };
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    const result = await apiCall<{ message: string }>("/api/proxy/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
    if (!result.ok) return { success: false, error: result.error, code: result.code };
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
        googleLogin,
        verifyEmail,
        resendVerification,
        requestPasswordReset,
        resetPassword,
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
