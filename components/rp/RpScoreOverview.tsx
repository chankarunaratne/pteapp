"use client";

import type { RpScoreResult } from "@/lib/rpScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function RpScoreOverview({
  score,
  lang = "si",
}: {
  score: RpScoreResult;
  lang?: FeedbackLang;
}) {
  const pct = score.maxScore > 0 ? Math.round((score.correctCount / score.maxScore) * 100) : 0;
  const isPerfect = score.correctCount === score.maxScore;

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
          {score.correctCount} / {score.maxScore}{" "}
          <span className="text-sm font-normal text-gray-500">
            {lang === "si" ? "ලකුණු" : "points"}
          </span>
        </p>
        <p className={`mt-0.5 text-xs text-gray-500`}>
          {lang === "si"
            ? `නිවැරදි සම්බන්ධතා (adjacent pairs): ${score.correctCount} / ${score.maxScore}`
            : `Correct adjacent pairs: ${score.correctCount} of ${score.maxScore}`}
        </p>
        <p className={`mt-1 text-sm ${lang === "si" ? "sinhala" : ""} text-gray-500`}>
          {isPerfect
            ? lang === "si"
              ? "ඡේද සියල්ලම නිවැරදි පිළිවෙළට සකසා ඇත — විශිෂ්ටයි!"
              : "All paragraphs in correct order — perfect!"
            : lang === "si"
              ? "සම්බන්ධතා වැරදුණු ආකාරය පහතින් බලා ඉගෙන ගන්න."
              : "Review incorrect transitions below."}
        </p>
      </div>
    </div>
  );
}
