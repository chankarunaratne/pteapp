"use client";

import type { McmaScoreResult } from "@/lib/mcmaScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function McmaScoreOverview({
  score,
  lang = "si",
}: {
  score: McmaScoreResult;
  lang?: FeedbackLang;
}) {
  const pct = Math.round((score.finalScore / score.maxScore) * 100);
  const isPerfect = score.finalScore === score.maxScore;

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
            className={isPerfect ? "stroke-green-500" : pct >= 60 ? "stroke-brand-500" : "stroke-amber-500"}
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
        <p className={`mt-0.5 text-xs text-slate-500`}>
          {lang === "si"
            ? `නිවැරදිව තේරූ පිළිතුරු: ${score.correctSelectedCount} (ලකුණු +${score.correctSelectedCount})`
            : `Correctly selected: ${score.correctSelectedCount} (+${score.correctSelectedCount} pts)`}
          {score.incorrectSelectedCount > 0 && (
            <span className="text-red-500 ml-1.5">
              {lang === "si"
                ? `| වැරදියට තේරූ පිළිතුරු දඬුවම්: -${score.incorrectSelectedCount}`
                : `| Incorrect choices penalty: -${score.incorrectSelectedCount}`}
            </span>
          )}
        </p>
        <p className={`mt-1 text-sm ${lang === "si" ? "sinhala" : ""} text-slate-500`}>
          {isPerfect
            ? lang === "si"
              ? "සියලුම නිවැරදි පිළිතුරු තෝරා ඇත — විශිෂ්ටයි!"
              : "All correct options selected — perfect!"
            : lang === "si"
              ? "වැරදුණු හෝ මඟ හැරුණු පිළිතුරු පහතින් බලන්න."
              : "Review incorrect selections or missed options below."}
        </p>
      </div>
    </div>
  );
}
