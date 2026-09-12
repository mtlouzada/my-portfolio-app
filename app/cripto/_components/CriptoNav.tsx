"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCriptoTheme } from "@/lib/useCriptoTheme";
import { useLanguage } from "@/lib/useLanguage";
import { criptoDict } from "../_i18n";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
      <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="6.7" y2="17.3" />
      <line x1="17.3" y1="6.7" x2="19.1" y2="4.9" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" fill="currentColor" />
    </svg>
  );
}

function ThemeToggle({ label, className = "" }: { label: string; className?: string }) {
  const { theme, toggle } = useCriptoTheme();
  return (
    <button
      onClick={toggle}
      aria-label={label}
      className={`w-9 h-9 shrink-0 border-2 border-[var(--c-ink)] bg-[var(--c-paper)] text-[var(--c-ink)] grid place-items-center hover:-translate-y-0.5 transition-transform ${className}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  const ct = criptoDict[lang];
  return (
    <button
      onClick={toggle}
      aria-label={ct.nav.switchLang}
      className={`h-9 px-2 shrink-0 border-2 border-[var(--c-ink)] bg-[var(--c-paper)] c-mono text-[10px] tracking-[0.08em] flex items-center gap-1 hover:-translate-y-0.5 transition-transform ${className}`}
    >
      <span className={lang === "pt" ? "text-[var(--c-red)] font-bold" : "text-[var(--c-ink-soft)]"}>PT</span>
      <span className="text-[var(--c-ink-soft)]">/</span>
      <span className={lang === "en" ? "text-[var(--c-red)] font-bold" : "text-[var(--c-ink-soft)]"}>EN</span>
    </button>
  );
}

export default function CriptoNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { lang } = useLanguage();
  const { nav } = criptoDict[lang];
  const links = nav.links;

  // Hide on scroll down, reveal on scroll up (mobile) so the nav is
  // reachable from anywhere in the page.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      setHidden(y > 80 && delta > 0);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        hidden && !open ? "-translate-y-full md:translate-y-0" : "translate-y-0"
      }`}
    >
      {/* fake OS menu bar */}
      <div className="c-mono text-[10.5px] tracking-[0.06em] bg-[var(--c-void)] text-[var(--c-white)] px-3 py-1 flex items-center gap-4">
        <span className="opacity-70">File</span>
        <span className="opacity-70">Edit</span>
        <span className="opacity-70">View</span>
        <span className="ml-auto opacity-70">louzoshi.eth</span>
        <span className="opacity-70">online ●</span>
      </div>

      {/* main nav */}
      <nav className="bg-[var(--c-paper)] border-b-2 border-[var(--c-ink)]">
        <div className="max-w-[1160px] mx-auto px-5 h-[52px] flex items-center justify-between gap-4">
          <Link
            href="/cripto"
            className="c-display text-[19px] flex items-center gap-2"
          >
            <span className="text-[var(--c-red)]">◆</span>LOUZOSHI
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="c-mono text-[11px] tracking-[0.1em] uppercase px-3 py-2 hover:text-[var(--c-red)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <LangToggle className="ml-2" />
            <ThemeToggle label={nav.toggleTheme} className="ml-1" />
            <Link
              href="/"
              className="c-mono text-[11px] tracking-[0.1em] uppercase px-3 py-2 border-2 border-[var(--c-ink)] ml-1 bg-[var(--c-lime)] text-[var(--c-on-bright)] hover:-translate-y-0.5 transition-transform"
            >
              {nav.backToPortfolio}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LangToggle />
            <ThemeToggle label={nav.toggleTheme} />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={nav.menu}
              className="w-9 h-9 border-2 border-[var(--c-ink)] flex items-center justify-center bg-[var(--c-paper)] text-[var(--c-ink)]"
            >
              <span className="c-mono text-sm">{open ? "✕" : "≡"}</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t-2 border-[var(--c-ink)] px-5 py-3 flex flex-col gap-1 bg-[var(--c-paper)]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="c-mono text-[13px] tracking-[0.08em] uppercase py-2.5"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="c-mono text-[13px] tracking-[0.08em] uppercase py-2.5 mt-1 border-2 border-[var(--c-ink)] bg-[var(--c-lime)] text-[var(--c-on-bright)] text-center"
            >
              {nav.backToPortfolioLong}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
