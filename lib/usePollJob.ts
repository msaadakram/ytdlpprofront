"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Shared job-polling hook: stores the timeout id in a ref, guards setState
 * with a mounted ref, supports AbortController cancellation, and cleans up
 * on unmount. Behavior for callers is identical to the previous inline loops.
 */
export function usePollJob() {
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearTimeout(pollRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const cancel = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  /**
   * Poll `fn` every `intervalMs` until `isDone` returns true or maxRetries.
   * `onStatus`/`onDone` are only invoked while mounted.
   */
  const poll = useCallback(
    async <T,>(
      fn: (signal: AbortSignal) => Promise<T>,
      opts: {
        isDone: (v: T) => boolean;
        onStatus: (v: T) => void;
        onDone: (v: T) => void;
        intervalMs?: number;
        maxRetries?: number;
        onTimeout?: () => void;
        onError?: (err: unknown) => void;
      },
    ): Promise<void> => {
      const { isDone, onStatus, onDone, intervalMs = 1000, maxRetries = 180, onTimeout, onError } = opts;
      cancel();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let retries = 0;

      return new Promise<void>((resolve, reject) => {
        const tick = async () => {
          if (!mountedRef.current || ctrl.signal.aborted) return;
          if (retries >= maxRetries) {
            onTimeout?.();
            reject(new Error("Poll timed out"));
            return;
          }
          retries++;
          try {
            const v = await fn(ctrl.signal);
            if (!mountedRef.current || ctrl.signal.aborted) return;
            onStatus(v);
            if (isDone(v)) {
              onDone(v);
              resolve();
              return;
            }
            pollRef.current = setTimeout(tick, intervalMs);
          } catch (err) {
            if (!mountedRef.current || ctrl.signal.aborted) return;
            onError?.(err);
            reject(err);
          }
        };
        tick();
      });
    },
    [cancel],
  );

  return { pollRef, mountedRef, cancel, poll };
}
