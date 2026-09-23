"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked for less motion.
 *
 * `useSyncExternalStore` rather than an effect, because this decides what is
 * rendered rather than merely how it behaves. A hook that reports "no
 * preference" on the server and "reduce" on the client makes the two trees
 * disagree, and React rejects that as a hydration mismatch — which is exactly
 * what happened here (error #418) when the server rendered a shader and the
 * client rendered a still gradient.
 *
 * The server snapshot is `false`: without a client there is no preference to
 * read, and React re-renders with the real value immediately after hydrating.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
