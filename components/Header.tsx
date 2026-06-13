"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Header() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-slate-200/70 bg-white px-6 lg:px-12">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Feedback:</span>
        <div
          className="flex shrink-0 overflow-hidden rounded-lg border border-slate-300 text-xs font-semibold"
          role="group"
          aria-label="Feedback language"
        >
          <button
            type="button"
            onClick={() => setLang("si")}
            className={`sinhala px-3 py-1.5 transition cursor-pointer ${
              lang === "si"
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            සිංහල
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 transition cursor-pointer ${
              lang === "en"
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  );
}
