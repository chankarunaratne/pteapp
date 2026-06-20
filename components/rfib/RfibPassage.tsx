"use client";

import type { RfibBlank } from "@/lib/questions";
import type { RfibBlankResult } from "@/lib/rfibScoring";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface PassageSegment {
  type: "text" | "blank";
  value: string;
  blankIndex?: number;
}

/**
 * Parse a passage string with {{answer|opt1,opt2,opt3,opt4}} markers
 * into renderable segments.
 */
function parsePassage(passage: string): PassageSegment[] {
  const parts = passage.split(/(\{\{[^}]+\}\})/g);
  let blankIdx = 0;
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      const match = part.match(/^\{\{([^}]+)\}\}$/);
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

export default function RfibPassage({
  passage,
  blanks,
  selections,
  onChange,
  results,
  disabled = false,
}: {
  passage: string;
  blanks: RfibBlank[];
  selections: string[];
  onChange: (index: number, value: string) => void;
  /** When provided, the component is in "result" mode. */
  results?: RfibBlankResult[];
  disabled?: boolean;
}) {
  const segments = parsePassage(passage);

  return (
    <div className="text-base leading-[2.6] text-gray-800">
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <span key={i}>{seg.value}</span>;
        }

        const idx = seg.blankIndex!;
        const blank = blanks[idx];
        const result = results?.[idx];
        const isCorrect = result?.correct;
        const showResult = result !== undefined;
        const selectedValue = selections[idx] ?? "";

        return (
          <span key={i} className="inline-block align-baseline mx-0.5">
            <span className="relative inline-flex flex-col items-start">
              <select
                value={selectedValue}
                onChange={(e) => onChange(idx, e.target.value)}
                disabled={disabled || showResult}
                className={`
                  inline-block min-w-[140px] appearance-none rounded-lg border
                  pl-3 pr-8 py-1.5 text-sm font-medium
                  transition-colors duration-200 align-baseline
                  cursor-pointer
                  focus:outline-none focus:ring-2
                  ${
                    showResult
                      ? isCorrect
                        ? "border-green-400 bg-green-50 text-green-800 ring-0"
                        : "border-red-400 bg-red-50 text-red-700 ring-0"
                      : selectedValue
                        ? "border-primary-400 bg-primary-50/40 text-gray-900 focus:border-primary-500 focus:ring-primary-100"
                        : "border-gray-300 bg-white text-gray-500 focus:border-primary-500 focus:ring-primary-100"
                  }
                  ${disabled && !showResult ? "cursor-not-allowed bg-gray-50" : ""}
                `}
                aria-label={`Blank ${idx + 1}`}
                style={{
                  backgroundImage: showResult
                    ? "none"
                    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.25em 1.25em",
                }}
              >
                <option value="" disabled>
                  Select…
                </option>
                {blank.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

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
