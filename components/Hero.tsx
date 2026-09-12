"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import LetterGlitch from "./LetterGlitch";
import { useLanguage } from "@/lib/useLanguage";
import { useTheme } from "@/lib/useTheme";

/* Palettes per theme: the glitch grid has to sit behind dark text in light mode
   and light text in dark mode, so both the backdrop and the glyphs swap. */
const PALETTE = {
  light: {
    background: "#ffffff",
    colors: ["#ededf2", "#dedef0", "#bfbfe8"],
    scrim: "rgba(255,255,255,0.9)",
    chip: "rgba(255,255,255,0.6)",
  },
  dark: {
    background: "#0a0a0b",
    colors: ["#1c1c23", "#2c2c40", "#5b5bd6"],
    scrim: "rgba(10,10,11,0.9)",
    chip: "rgba(10,10,11,0.6)",
  },
} as const;

export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const palette = PALETTE[theme];

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* animated backdrop */}
      <div className="absolute inset-0">
        <LetterGlitch
          glitchSpeed={100}
          outerVignette
          smooth
          glitchColors={[...palette.colors]}
          background={palette.background}
        />
      </div>

      {/* legibility scrim: a soft wash behind the centred content plus a fade
          at the bottom so the hero melts into the page background. Phones get a
          wider veil — the text block fills almost the whole screen there. */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background: `radial-gradient(ellipse 110% 52% at 50% 50%, ${palette.scrim} 0%, ${palette.scrim} 62%, transparent 100%),
                       linear-gradient(to bottom, transparent 70%, var(--bg) 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: `radial-gradient(ellipse 78% 64% at 50% 50%, ${palette.scrim} 0%, ${palette.scrim} 40%, transparent 92%),
                       linear-gradient(to bottom, transparent 60%, var(--bg) 100%)`,
        }}
      />

      {/* content — centred column */}
      <div className="relative z-10 w-full max-w-[1120px] mx-auto px-6 pt-28 pb-24 text-center flex flex-col items-center">
        <Reveal delay={0.04}>
          <div className="relative w-[180px] sm:w-[210px] md:w-[230px] aspect-square rounded-full overflow-hidden ring-1 ring-line shadow-elevated">
            <Image
              src="/imgs/newphoto.jpg"
              alt="Matheus Louzada"
              fill
              priority
              sizes="(max-width: 768px) 210px, 230px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-8">
          <p className="label-mono">{t.hero.role}</p>
        </Reveal>

        <Reveal delay={0.18} className="mt-4">
          <h1 className="text-[clamp(44px,9vw,88px)] leading-[1.02] tracking-[-0.04em] font-semibold text-fg">
            Matheus Louzada
          </h1>
        </Reveal>

        <Reveal delay={0.26} className="mt-6">
          <p className="max-w-[560px] mx-auto text-[clamp(16px,2vw,20px)] leading-[1.55] text-muted text-pretty">
            {t.hero.description}
          </p>
        </Reveal>

        <Reveal delay={0.34} className="mt-9">
          <div className="flex flex-wrap gap-3.5 justify-center max-[480px]:flex-col max-[480px]:items-stretch">
            <a
              href="#projetos"
              className="px-7 py-3.5 rounded-pill bg-accent text-white font-medium text-[15px] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(91,91,214,0.55)]"
            >
              {t.hero.viewProjects}
            </a>
            <a
              href="https://github.com/mtlouzada"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: palette.chip }}
              className="px-[22px] py-3.5 rounded-pill border border-line text-fg text-[15px] backdrop-blur-sm transition-all duration-300 hover:bg-elev hover:-translate-y-0.5"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/matheus-louzadaa/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: palette.chip }}
              className="px-[22px] py-3.5 rounded-pill border border-line text-fg text-[15px] backdrop-blur-sm transition-all duration-300 hover:bg-elev hover:-translate-y-0.5"
            >
              LinkedIn ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
