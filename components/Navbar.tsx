"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { useLanguage } from "@/lib/useLanguage";

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.2" y1="4.2" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.8" y2="19.8" />
      <line x1="4.2" y1="19.8" x2="6" y2="18" />
      <line x1="18" y1="6" x2="19.8" y2="4.2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" fill="currentColor" />
    </svg>
  );
}

/** Ethereum diamond with the same iridescent gradient used in /cripto.
   `id` keeps gradient defs unique when the mark renders twice (desktop + mobile menu). */
function EthMark({ id, className = "" }: { id: string; className?: string }) {
  const grad = `eth-grad-${id}`;
  return (
    <svg viewBox="0 0 256 417" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="28%" stopColor="#818cf8" />
          <stop offset="52%" stopColor="#c084fc" />
          <stop offset="74%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      <g fill={`url(#${grad})`}>
        <polygon opacity="0.7" points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32" />
        <polygon points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" />
        <polygon opacity="0.7" points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866" />
        <polygon points="127.962 416.9052 127.962 312.1852 0 236.5852" />
        <polygon opacity="0.45" points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587" />
        <polygon opacity="0.6" points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588" />
      </g>
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="Início" className="group flex items-center gap-2.5">
      <span className="grid place-items-center w-[34px] h-[34px] rounded-[11px] bg-fg text-bg font-bold text-[13px] tracking-[-0.03em] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        ML
      </span>
      <span className="hidden sm:block font-semibold text-[15px] tracking-[-0.01em] text-fg">
        Matheus Louzada
      </span>
    </Link>
  );
}

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle, t } = useLanguage();
  return (
    <button
      onClick={toggle}
      aria-label={t.nav.switchLang}
      className={`h-9 px-2.5 rounded-full border border-line flex items-center gap-1 font-mono text-[11px] tracking-[0.04em] hover:bg-elev transition-colors ${className}`}
    >
      <span className={lang === "pt" ? "text-fg font-semibold" : "text-muted"}>PT</span>
      <span className="text-muted opacity-50">/</span>
      <span className={lang === "en" ? "text-fg font-semibold" : "text-muted"}>EN</span>
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const links = t.nav.links;

  // Floating island: detached from the top edge so the hero background runs
  // behind and around the bar.
  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-5">
      {/* the open mobile menu goes opaque — a translucent panel over the hero
          photo is unreadable */}
      <nav
        className={`mx-auto max-w-[1120px] rounded-2xl border border-line backdrop-blur-md backdrop-saturate-150 shadow-elevated overflow-hidden transition-colors duration-300 ${
          open ? "bg-[var(--bg)]" : "bg-[var(--nav-bg)]"
        }`}
      >
        <div className="px-4 sm:px-5 h-[58px] flex items-center justify-between gap-4">
          {/* left — logo */}
          <Logo />

          {/* right — links, utilities, and the crypto CTA anchoring the edge */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-0.5 mr-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-[14px] py-2 rounded-pill text-[14px] text-muted hover:text-fg hover:bg-elev transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <LangToggle className="hidden sm:flex" />

            <button
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              aria-label={t.nav.toggleTheme}
              className="w-9 h-9 rounded-full border border-line text-fg flex items-center justify-center hover:bg-elev transition-colors"
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </button>

            <Link
              href="/cripto"
              className="crypto-pill group hidden sm:inline-flex items-center gap-2 pl-3 pr-3.5 h-9 rounded-pill text-[13.5px] font-medium text-white bg-accent shadow-[0_6px_18px_-8px_rgba(91,91,214,0.8)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_-8px_rgba(91,91,214,0.9)]"
            >
              <EthMark
                id="nav"
                className="eth-holo h-[15px] w-auto transition-transform duration-300 group-hover:-translate-y-[1.5px] group-hover:scale-110"
              />
              Web3
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={t.nav.menu}
              className="md:hidden w-9 h-9 rounded-full border border-line text-fg flex items-center justify-center hover:bg-elev transition-colors"
            >
              {open ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-line px-3 pb-3 pt-2 flex flex-col gap-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3.5 rounded-xl text-[17px] font-medium text-fg hover:bg-elev transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cripto"
              onClick={() => setOpen(false)}
              className="px-3 py-3.5 rounded-xl text-[17px] font-medium text-white bg-accent mt-1 inline-flex items-center gap-2.5"
            >
              <EthMark id="menu" className="eth-holo h-[18px] w-auto" />
              Web3 ↗
            </Link>
            <div className="px-3 pt-3 pb-1">
              <LangToggle />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
