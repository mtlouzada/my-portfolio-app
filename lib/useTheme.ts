"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

/* Theme toggle with a circular reveal (View Transitions API).
   The new theme expands from the toggle button as a smooth circle, with the old
   theme sitting frozen underneath until the frontier passes over it. Browsers
   without the API, and users with prefers-reduced-motion, get the plain instant
   toggle. */

const DURATION = 1100; // ms — total reveal time
const PAD = 32; // px — radius overshoot so the circle fully clears the corner

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  // Sync with whatever the inline layout script already applied, and keep
  // every consumer of the hook in sync afterwards: each call site holds its own
  // state, so a toggle fired from the navbar has to reach the rest of the page
  // through the attribute it writes on <html>.
  useEffect(() => {
    const read = () =>
      setTheme(
        (document.documentElement.getAttribute("data-theme") ??
          "light") as Theme,
      );
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ml-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  /** `origin` = viewport point the reveal expands from (the button center). */
  const toggle = (origin?: { x: number; y: number }) => {
    // Read the source of truth from the DOM so a stale state can't flip wrong.
    const current =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    const next: Theme = current === "dark" ? "light" : "dark";

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!doc.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }

    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 30;
    // Farthest viewport corner, padded so the circle always covers the screen.
    const cover = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const R = cover + PAD;

    const transition = doc.startViewTransition(() => {
      // Force the re-render inside the callback so the "new" snapshot is final.
      flushSync(() => applyTheme(next));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${R}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: DURATION,
            easing: "cubic-bezier(0.33, 1, 0.68, 1)", // easeOutCubic
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        /* transition skipped (e.g. rapid toggling) — theme is applied anyway */
      });
  };

  return { theme, toggle };
}
