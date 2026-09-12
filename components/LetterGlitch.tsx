"use client";

import { useEffect, useRef } from "react";

/* Letter-glitch canvas background (port of the ReactBits effect).
   A monospace grid of random characters where a random subset re-rolls its
   glyph/colour every tick, giving a quiet "decoding terminal" texture.
   - Colours come in from the caller so the effect follows the site theme.
   - Honors prefers-reduced-motion: paints one static frame and stops.
   - Purely decorative → aria-hidden. */

type LetterGlitchProps = {
  /** palette the glyphs cycle through */
  glitchColors?: string[];
  /** canvas backdrop (should match the section background) */
  background?: string;
  /** ms between glitch ticks — lower is faster */
  glitchSpeed?: number;
  /** fade colours into each other instead of snapping */
  smooth?: boolean;
  /** radial fade towards the edges of the canvas */
  outerVignette?: boolean;
  /** radial fade towards the middle, so centred text stays readable */
  centerVignette?: boolean;
  className?: string;
};

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&*()-_+=/[]{};:<>.,0123456789".split(
    "",
  );
const FONT_SIZE = 16;
const CHAR_W = 10;
const CHAR_H = 20;

type Letter = {
  char: string;
  color: string;
  target: string;
  progress: number;
};

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/** "#rrggbb" → {r,g,b}; returns null for anything else. */
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, "#$1$1$2$2$3$3"),
  );
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : null;
}

function mix(from: string, to: string, t: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  if (!a || !b) return to;
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)}, ${Math.round(
    a.g + (b.g - a.g) * t,
  )}, ${Math.round(a.b + (b.b - a.b) * t)})`;
}

export default function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  background = "#000000",
  glitchSpeed = 50,
  smooth = true,
  outerVignette = true,
  centerVignette = false,
  className = "",
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lettersRef = useRef<Letter[]>([]);
  const drawRef = useRef<() => void>(() => {});
  // Kept in refs so the animation loop always reads the latest values without
  // being torn down and rebuilt on every render.
  const colorsRef = useRef(glitchColors);
  const speedRef = useRef(glitchSpeed);
  const smoothRef = useRef(smooth);
  const bgRef = useRef(background);
  colorsRef.current = glitchColors;
  speedRef.current = glitchSpeed;
  smoothRef.current = smooth;
  bgRef.current = background;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let columns = 0;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    const makeLetter = (): Letter => {
      const color = rand(colorsRef.current);
      return { char: rand(CHARS), color, target: color, progress: 1 };
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = bgRef.current;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      lettersRef.current.forEach((letter, i) => {
        const x = (i % columns) * CHAR_W;
        const y = Math.floor(i / columns) * CHAR_H;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, x, y);
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.max(1, Math.ceil(rect.width / CHAR_W));
      const rows = Math.max(1, Math.ceil(rect.height / CHAR_H));
      lettersRef.current = Array.from({ length: columns * rows }, makeLetter);
      draw();
    };

    /** Re-roll ~5% of the grid, so the change reads as a flicker not a wipe. */
    const glitch = () => {
      const letters = lettersRef.current;
      const count = Math.max(1, Math.floor(letters.length * 0.05));
      for (let n = 0; n < count; n++) {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        if (!letter) continue;
        letter.char = rand(CHARS);
        letter.target = rand(colorsRef.current);
        if (smoothRef.current) {
          letter.progress = 0;
        } else {
          letter.color = letter.target;
        }
      }
    };

    /** Advance the colour fades; returns true when something moved. */
    const step = (dt: number) => {
      let moved = false;
      lettersRef.current.forEach((letter) => {
        if (letter.progress >= 1) return;
        letter.progress = Math.min(1, letter.progress + dt / 280);
        letter.color = mix(letter.color, letter.target, letter.progress);
        moved = true;
      });
      return moved;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = now - last;
      let dirty = false;
      if (dt >= speedRef.current) {
        last = now;
        glitch();
        dirty = true;
      }
      if (smoothRef.current && step(dt)) dirty = true;
      if (dirty) draw();
    };

    drawRef.current = draw;
    resize();
    if (!reduce) frame = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Nothing to animate while the hero is scrolled away — skip the redraw
    // instead of burning frames behind the rest of the page.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        last = performance.now();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
    // Colours/speed live in refs; the effect only needs to run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A theme swap changes the whole palette: re-roll every glyph at once and
  // repaint, otherwise letters keep their old-theme colour for seconds while
  // the 5%-per-tick glitch slowly catches up.
  const colorKey = glitchColors.join(",");
  useEffect(() => {
    lettersRef.current.forEach((letter) => {
      const color = colorsRef.current[
        Math.floor(Math.random() * colorsRef.current.length)
      ];
      letter.color = color;
      letter.target = color;
      letter.progress = 1;
    });
    drawRef.current();
  }, [colorKey, background]);

  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle, rgba(0,0,0,0) 60%, ${background} 100%)`,
          }}
        />
      )}
      {centerVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${background} 0%, rgba(0,0,0,0) 60%)`,
          }}
        />
      )}
    </div>
  );
}
