"use client";

import type { FibScoreResult } from "@/lib/fibScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function FibScoreOverview({
  score,
  lang = "si",
}: {
  score: FibScoreResult;
  lang?: FeedbackLang;
}) {
  const pct = Math.round((score.correctCount / score.totalBlanks) * 100);
  const isPerfect = score.correctCount === score.totalBlanks;

  return (
    <div className="flex items-center gap-5">
      {/* Ring gauge */}
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            strokeWidth="3"
            className="stroke-gray-100"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={isPerfect ? "stroke-green-500" : pct >= 60 ? "stroke-primary-500" : "stroke-amber-500"}
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
          {pct}%
        </span>
      </div>

      {/* Score text */}
      <div>
        <p className="text-lg font-bold text-gray-900">
          {score.correctCount} / {score.totalBlanks}{" "}
          <span className="text-sm font-normal text-gray-500">
            {lang === "si" ? "හිස්තැන් නිවැරදියි" : "blanks correct"}
          </span>
        </p>
        <p className={`mt-0.5 text-sm ${lang === "si" ? "sinhala" : ""} text-gray-500`}>
          {isPerfect
            ? lang === "si"
              ? "සියලුම හිස්තැන් නිවැරදියි — නියමයි!"
              : "All blanks correct — perfect!"
            : lang === "si"
              ? "වැරදුණු හිස්තැන් පහළින් බලන්න."
              : "Review the incorrect blanks below."}
        </p>
      </div>
    </div>
  );
}
