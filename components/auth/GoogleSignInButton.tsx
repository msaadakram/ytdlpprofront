"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          prompt: (notification?: (n: unknown) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";
let gsiLoadPromise: Promise<void> | null = null;

function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiLoadPromise) return gsiLoadPromise;

  gsiLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_URL}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Sign-In script")));
      if ((existing as unknown as { dataset: { loaded?: string } }).dataset?.loaded === "true") resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (script as unknown as { dataset: { loaded?: string } }).dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google Sign-In script"));
    document.head.appendChild(script);
  });
  return gsiLoadPromise;
}

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup";
  onError?: (msg: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ mode = "signin", onError, disabled }: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const handleCredential = useCallback(async (response: { credential: string }) => {
    const idToken = response.credential;
    if (!idToken) {
      const msg = "Google did not return a credential";
      setScriptError(msg);
      onError?.(msg);
      return;
    }
    setLoading(true);
    try {
      const result = await googleLogin(idToken);
      if (!result.success) {
        const errMsg = result.error || "Google Sign-In failed";
        setScriptError(errMsg);
        onError?.(errMsg);
        return;
      }
      // Success — navigate to dashboard (or retain current page)
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google Sign-In failed";
      setScriptError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }, [googleLogin, onError, router]);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    loadGsiScript()
      .then(() => {
        if (cancelled) return;
        if (!window.google?.accounts?.id) throw new Error("Google Identity Services not available");
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          // Opt-out of FedCM until adoption stabilizes; keeps classic One Tap UX
          use_fedcm_for_prompt: false,
        });
        setScriptReady(true);
        // Optionally render the One Tap prompt on mount for sign-in pages? Disabled by default to avoid intrusive prompt.
        // window.google.accounts.id.prompt();
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Failed to load Google Sign-In";
        setScriptError(msg);
        onError?.(msg);
      });
    return () => { cancelled = true; };
  }, [clientId, handleCredential, onError]);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.google?.accounts?.id) return;
    const render = () => {
      if (!containerRef.current || !window.google?.accounts?.id) return;
      containerRef.current.innerHTML = "";
      try {
        const w = containerRef.current.offsetWidth;
        // Mobile: leave 8px breathing room, cap at 360 for larger screens, fallback 240 for 320px
        const width = w ? Math.min(Math.max(w - 2, 220), 360) : 240;
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: mode === "signup" ? "signup_with" : "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width,
        });
      } catch (err) {
        console.warn("Failed to render Google button", err);
      }
    };
    render();
    const onResize = () => render();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scriptReady, mode]);

  if (!clientId) {
    return (
      <div className="w-full rounded-xl sm:rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-sans flex flex-col xs:flex-row items-start xs:items-center gap-2 break-words">
        <span className="inline-flex items-center gap-2 shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span className="font-semibold">Google Sign-In not configured.</span>
        </span>
        <span className="text-xs break-all">
          Set <code className="font-mono text-[11px] sm:text-xs bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded break-all">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to enable.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* GSI rendered button — responsive, fills container */}
      <div
        ref={containerRef}
        className={`w-full max-w-full flex justify-center overflow-hidden ${disabled || loading ? "pointer-events-none opacity-60" : ""} ${scriptError ? "hidden" : ""}`}
        aria-hidden={scriptError ? true : undefined}
        style={{ minHeight: 40 }}
      />

      {/* Fallback custom styled button — visible if renderButton fails or to provide consistent branded styling */}
      {/* We keep GSI button as primary; custom button acts as backup trigger via prompt */}
      {scriptError && (
        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-xl px-3 sm:px-4 py-3 font-sans break-words" role="alert">
          {scriptError}
        </p>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#0d1f26]/60 dark:text-white/50 font-sans">
          <span className="w-4 h-4 border-2 border-[#0d1f26]/20 border-t-[#0d1f26] dark:border-white/20 dark:border-t-white rounded-full animate-spin" />
          Connecting to Google…
        </div>
      )}

      {/* If GSI not yet ready but clientId present, show skeleton custom button */}
      {!scriptReady && !scriptError && (
        <button
          type="button"
          disabled
          className="w-full max-w-full flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-white/10 border border-[#0d1f26]/10 dark:border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-[#0d1f26]/60 dark:text-white/60 font-sans opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
          </svg>
          Loading Google…
        </button>
      )}
    </div>
  );
}

// Helper component for the branded custom Google button (optional manual trigger) — mobile responsive
export function GoogleBrandedButton({
  mode = "signin",
  onClick,
  loading,
  disabled,
}: {
  mode?: "signin" | "signup";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const label = mode === "signup" ? "Sign up with Google" : "Continue with Google";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full max-w-full flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-white text-[#0d1f26] border border-[#0d1f26]/10 hover:bg-[#f8fafc] dark:hover:bg-[#f1f5f9] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(13,31,38,0.06)] dark:shadow-none hover:shadow-[0_4px_16px_rgba(13,31,38,0.08)] transition-all font-sans disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none touch-manipulation"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-[#0d1f26]/20 border-t-[#0d1f26] rounded-full animate-spin" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
        </svg>
      )}
      {label}
    </button>
  );
}
