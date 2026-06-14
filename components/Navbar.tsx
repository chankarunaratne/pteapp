"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { login, logout } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Practice", href: "/practice" },
  { label: "Course", href: "/course" },
  { label: "Mock exam", href: "/mock-exam" },
  { label: "PTE format", href: "/pte-format" },
];

/* ------------------------------------------------------------------ */
/*  Hook: measure the active nav link so the pill can slide to it      */
/* ------------------------------------------------------------------ */

function useActivePill(pathname: string) {
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const links = nav.querySelectorAll<HTMLElement>("[data-nav-link]");
    for (const link of links) {
      if (link.dataset.active === "true") {
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        setPill({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          ready: true,
        });
        return;
      }
    }
    // No active link found — hide pill
    setPill((p) => ({ ...p, ready: false }));
  }, []);

  // Measure on mount + whenever pathname changes
  // useLayoutEffect avoids a visible flash on first render
  useLayoutEffect(() => {
    measure();
  }, [pathname, measure]);

  // Re-measure on resize
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return { navRef, pill };
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { navRef, pill } = useActivePill(pathname);

  // Check login status on mount
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("pb_session="));
  }, []);

  const handleLogin = async () => {
    await login();
    setIsLoggedIn(true);
    router.push("/practice");
    router.refresh();
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white">
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* -------- Left: Logo + Nav -------- */}
        <div className="flex h-full items-center gap-10">
          {/* Logo */}
          <Link
            href={isLoggedIn ? "/practice" : "/"}
            className="flex items-center gap-2.5"
          >
            {/* Blue circle icon */}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              L
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              Lanka<span className="text-brand-600">PTE</span>
            </span>
          </Link>

          {/* Navigation with animated underline */}
          <nav ref={navRef} className="relative flex h-full items-center gap-1">
            {/* Sliding underline indicator */}
            {pill.ready && (
              <span
                className="absolute bottom-0 h-0.5 rounded-full bg-brand-600 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{
                  left: pill.left,
                  width: pill.width,
                }}
                aria-hidden="true"
              />
            )}

            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-nav-link
                  data-active={isActive}
                  className={`relative z-10 px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* -------- Right: Auth + Settings -------- */}
        <div className="flex items-center gap-2">
          {/* Sign In / Sign Out */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg px-5 py-2 text-base font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="cursor-pointer rounded-lg bg-brand-600 px-7 py-2 text-base font-medium text-white transition-colors hover:bg-brand-700"
            >
              Sign in
            </button>
          )}

          {/* Settings gear */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-expanded={settingsOpen}
              aria-haspopup="true"
              aria-label="Settings"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200/80 bg-white p-2 shadow-lg shadow-slate-200/50 ring-1 ring-black/5">
                {/* Feedback language section */}
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Feedback language
                  </p>
                  <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-300 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setLang("si")}
                      className={`sinhala flex-1 cursor-pointer px-3 py-1.5 transition ${
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
                      className={`flex-1 cursor-pointer px-3 py-1.5 transition ${
                        lang === "en"
                          ? "bg-brand-600 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
