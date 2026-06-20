"use client";

import { useRef, useEffect } from "react";
import type { FibBlankResult } from "@/lib/fibScoring";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface PassageSegment {
  type: "text" | "blank";
  value: string; // text content or expected word
  blankIndex?: number;
}

/** Parse a passage string with {{word}} markers into segments. */
function parsePassage(passage: string): PassageSegment[] {
  const parts = passage.split(/(\{\{\w+\}\})/g);
  let blankIdx = 0;
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      const match = part.match(/^\{\{(\w+)\}\}$/);
      if (match) {
        return {
          type: "blank" as const,
          value: match[1],
          blankIndex: blankIdx++,
        };
      }
      return { type: "text" as const, value: part };
    });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FibPassage({
  passage,
  answers,
  onChange,
  results,
  disabled = false,
}: {
  passage: string;
  answers: string[];
  onChange: (index: number, value: string) => void;
  /** When provided, the component is in "result" mode. */
  results?: FibBlankResult[];
  disabled?: boolean;
}) {
  const segments = parsePassage(passage);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first blank on mount (question phase only).
  useEffect(() => {
    if (!results && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [results]);

  return (
    <div className="text-base leading-[2.4] text-gray-800">
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <span key={i}>{seg.value}</span>;
        }

        const idx = seg.blankIndex!;
        const result = results?.[idx];
        const isCorrect = result?.correct;
        const showResult = result !== undefined;

        return (
          <span key={i} className="inline-block align-baseline mx-0.5">
            <span className="relative inline-flex flex-col items-start">
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                value={answers[idx] ?? ""}
                onChange={(e) => onChange(idx, e.target.value)}
                disabled={disabled || showResult}
                spellCheck={false}
                autoComplete="off"
                className={`
                  inline-block w-36 rounded-lg border px-3 py-1 text-sm font-medium
                  transition-colors duration-200 align-baseline
                  focus:outline-none focus:ring-2
                  ${
                    showResult
                      ? isCorrect
                        ? "border-green-400 bg-green-50 text-green-800 ring-0"
                        : "border-red-400 bg-red-50 text-red-700 ring-0"
                      : "border-gray-300 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-100 placeholder:text-gray-400"
                  }
                  ${disabled && !showResult ? "cursor-not-allowed bg-gray-50" : ""}
                `}
                aria-label={`Blank ${idx + 1}`}
                onKeyDown={(e) => {
                  // Tab or Enter → focus next blank
                  if (e.key === "Tab" && !e.shiftKey) {
                    const next = inputRefs.current[idx + 1];
                    if (next) {
                      e.preventDefault();
                      next.focus();
                    }
                  }
                }}
              />
              {/* Show the correct answer below incorrect blanks */}
              {showResult && !isCorrect && (
                <span className="mt-0.5 text-xs font-medium text-green-700">
                  ✓ {result.expected}
                </span>
              )}
              {showResult && isCorrect && (
                <span className="mt-0.5 text-xs font-medium text-green-600">
                  ✓ Correct
                </span>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}
