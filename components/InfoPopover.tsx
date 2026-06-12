"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * An inline info icon button that reveals extra help text (e.g. Sinhala
 * translations) in a small popover. Rendered entirely with <span> elements so
 * it can safely live inside a <p> tag.
 */
export default function InfoPopover({
  children,
  label = "Show instructions in Sinhala",
  align = "left",
}: {
  children: ReactNode;
  label?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        title={label}
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition ${
          open
            ? "bg-brand-100 text-brand-700"
            : "text-slate-400 hover:bg-slate-100 hover:text-brand-600"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <span
          role="note"
          className={`absolute top-full z-20 mt-2 block w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <span className="sinhala block text-sm font-normal text-slate-600">
            {children}
          </span>
        </span>
      )}
    </span>
  );
}
