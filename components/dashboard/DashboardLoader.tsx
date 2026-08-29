import { motion } from "motion/react";

type DashboardLoaderProps = {
  /** Translated status line, e.g. "Loading your workspace…" */
  message: string;
  /** Optional action rendered under the message (e.g. "Go to Sign In" link) */
  children?: React.ReactNode;
};

/**
 * Branded full-screen loading state for the dashboard.
 *
 * Matches the site's design language: blueprint grid backdrop, ambient
 * accent glow, glass surfaces, brand conic-gradient orbit ring around the
 * DownForge mark, indeterminate shimmer progress bar, and mono micro-label.
 * All motion is disabled under `prefers-reduced-motion` (see globals.css).
 */
export function DashboardLoader({ message, children }: DashboardLoaderProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#f4f9fa] via-background to-background dark:from-[#0a161c] dark:via-[#081218] dark:to-[#060c10] flex items-center justify-center px-4 relative overflow-hidden"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Blueprint grid + ambient brand glow */}
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" aria-hidden />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#5baab8]/10 dark:bg-[#5baab8]/[0.08] blur-[110px] pointer-events-none animate-float-soft"
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Logo mark with orbiting brand ring + counter halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-20 h-20 sm:w-24 sm:h-24"
        >
          <div className="absolute -inset-1.5 rounded-full df-halo" aria-hidden />
          <div className="absolute inset-0 rounded-full df-orbit" aria-hidden />
          <div className="absolute inset-[9px] sm:inset-[11px] rounded-2xl bg-white dark:bg-[#0f1e26] border border-border/60 dark:border-white/10 shadow-[0_12px_36px_-10px_rgba(13,31,38,0.25)] flex items-center justify-center">
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain scale-110 animate-float-soft"
            />
          </div>
        </motion.div>

        {/* Brand micro-label */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70"
        >
          Downforge
        </motion.span>

        {/* Indeterminate progress sweep */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-3 w-44 sm:w-52 h-1 rounded-full bg-[#ddedf1] dark:bg-white/10 overflow-hidden"
          aria-hidden
        >
          <div className="df-loading-bar h-full w-1/3 rounded-full bg-gradient-to-r from-[#5baab8] via-[#8fd3df] to-[#3d8896]" />
        </motion.div>

        {/* Status line */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 text-sm text-muted-foreground font-sans"
        >
          {message}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Branded skeleton card used by dashboard tabs while data loads.
 * Keeps the site's card styling but swaps the flat pulse for a
 * theme-aware shimmer sweep (`.skeleton-shimmer`).
 */
export function DashboardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border/70 skeleton-shimmer shadow-[0_1px_2px_rgba(13,31,38,0.04)] ${className}`}
      aria-hidden
    />
  );
}