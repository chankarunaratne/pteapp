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
        className={`sinhala inline-flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full text-sm font-semibold transition ${
          open
            ? "bg-primary-100 text-primary-700"
            : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600"
        }`}
      >
        අ
      </button>

      {open && (
        <span
          role="note"
          className={`absolute top-full z-20 mt-2 block w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <span className="sinhala block text-sm font-normal text-gray-600">
            {children}
          </span>
        </span>
      )}
    </span>
  );
}
