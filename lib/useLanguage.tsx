"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

type LanguageContextValue = {
  lang: Lang;
  toggle: () => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Portuguese is the primary language; render it on the server and only
  // switch after mount so SSR and client markup stay in sync.
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ml-lang");
      if (stored === "pt" || stored === "en") setLang(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === "pt" ? "en" : "pt";
      document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
      try {
        localStorage.setItem("ml-lang", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
