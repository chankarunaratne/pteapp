"use client";

import type { McsaScoreResult } from "@/lib/mcsaScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function McsaScoreOverview({
  score,
  lang = "si",
}: {
  score: McsaScoreResult;
  lang?: FeedbackLang;
}) {
  const pct = score.isCorrect ? 100 : 0;

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
            className="stroke-slate-100"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={score.isCorrect ? "stroke-green-500" : "stroke-amber-500"}
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
          {pct}%
        </span>
      </div>

      {/* Score text */}
      <div>
        <p className="text-lg font-bold text-slate-900">
          {score.finalScore} / {score.maxScore}{" "}
          <span className="text-sm font-normal text-slate-500">
            {lang === "si" ? "ලකුණු" : "points"}
          </span>
        </p>
        <p className={`mt-1 text-sm ${lang === "si" ? "sinhala" : ""} text-slate-500`}>
          {score.isCorrect
            ? lang === "si"
              ? "නිවැරදි පිළිතුර තෝරා ඇත — විශිෂ්ටයි!"
              : "Correct option selected — perfect!"
            : lang === "si"
              ? "තෝරාගත් පිළිතුර වැරදියි. නිවැරදි පිළිතුර සහ පැහැදිලි කිරීම පහතින් බලන්න."
              : "Incorrect choice. Review the correct option and explanation below."}
        </p>
      </div>
    </div>
  );
}
