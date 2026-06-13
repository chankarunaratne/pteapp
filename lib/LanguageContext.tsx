"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { FeedbackLang } from "./feedback";

const LANG_STORAGE_KEY = "ptelanka-feedback-lang";

interface LanguageContextType {
  lang: FeedbackLang;
  setLang: (lang: FeedbackLang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<FeedbackLang>("si");

  useEffect(() => {
    const stored = sessionStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "si" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  const setLang = (next: FeedbackLang) => {
    setLangState(next);
    sessionStorage.setItem(LANG_STORAGE_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
