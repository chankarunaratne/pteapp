"use client";

import type { SwtScoreResult } from "@/lib/swtScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function SwtScoreOverview({
  score,
  lang = "si",
}: {
  score: SwtScoreResult;
  lang?: FeedbackLang;
}) {
  const pct = score.percentage;

  const ringColor =
    pct >= 70 ? "stroke-green-500" : pct >= 40 ? "stroke-amber-500" : "stroke-red-400";

  return (
    <div>
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
              className={ringColor}
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
            {score.finalScore} / {score.maxScore}{" "}
            <span className="text-sm font-normal text-gray-500">
              {lang === "si" ? "ලකුණු" : "points"}
            </span>
          </p>
          <p
            className={`mt-1 text-sm ${lang === "si" ? "sinhala" : ""} text-gray-500`}
          >
            {pct >= 70
              ? lang === "si"
                ? "හොඳ සාරාංශයක්! ප්‍රධාන කරුණු ආවරණය කර ඇත."
                : "Good summary! Key points are well covered."
              : pct >= 40
                ? lang === "si"
                  ? "සාමාන්‍ය මට්ටමක්. ප්‍රධාන අදහස් තවත් ඇතුළත් කරන්න."
                  : "Reasonable attempt. Include more key ideas."
                : lang === "si"
                  ? "තව වැඩිදියුණු කළ හැකිය. පහත ප්‍රතිපෝෂණය බලන්න."
                  : "Needs improvement. Review the feedback below."}
          </p>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {score.dimensions.map((dim) => {
          const dimPct =
            dim.maxScore > 0
              ? Math.round((dim.score / dim.maxScore) * 100)
              : 0;
          const barColor =
            dimPct >= 70
              ? "bg-green-500"
              : dimPct >= 40
                ? "bg-amber-500"
                : "bg-red-400";

          return (
            <div
              key={dim.label}
              className="rounded-xl border border-gray-100 bg-gray-50/50 p-3"
            >
              <p className={`text-xs font-semibold text-gray-500 ${lang === "si" ? "sinhala" : ""}`}>
                {lang === "si" ? dim.labelSi : dim.label}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {dim.score}/{dim.maxScore}
              </p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${barColor} transition-all`}
                  style={{ width: `${dimPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
