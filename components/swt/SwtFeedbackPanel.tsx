"use client";

import type { SwtScoreResult } from "@/lib/swtScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function SwtFeedbackPanel({
  score,
  sampleAnswer,
  explanationEn,
  explanationSi,
  lang = "si",
}: {
  score: SwtScoreResult;
  sampleAnswer: string;
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
}) {
  const pct = score.percentage;

  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (pct >= 70) {
      headline = "විශිෂ්ටයි! ඔබේ සාරාංශය ප්‍රධාන කරුණු හොඳින් ආවරණය කරයි.";
    } else if (pct >= 40) {
      headline = "හොඳ උත්සාහයක්, නමුත් තවත් ප්‍රධාන අදහස් ඇතුළත් කළ හැකිය.";
    } else {
      headline = "කමක් නැහැ — පහත ප්‍රතිපෝෂණය කියවා නැවත උත්සාහ කරන්න.";
    }
  } else {
    if (pct >= 70) {
      headline = "Excellent! Your summary covers the main points well.";
    } else if (pct >= 40) {
      headline = "Good effort, but more key ideas could be included.";
    } else {
      headline = "Don't worry — review the feedback below and try again.";
    }
  }

  // Per-dimension tips
  for (const dim of score.dimensions) {
    if (dim.score < dim.maxScore) {
      tips.push(lang === "si" ? dim.noteSi : dim.note);
    }
  }

  // General tips
  if (lang === "si") {
    tips.push(
      "PTE SWT ප්‍රශ්නවලදී ඔබේ පිළිතුර එක වාක්‍යයකින් විය යුතු අතර වචන 5–75 අතර විය යුතුය."
    );
  } else {
    tips.push(
      "In PTE SWT questions, your response must be a single sentence between 5 and 75 words."
    );
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
      <h3
        className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}
      >
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          pct >= 70 ? "text-green-700" : pct >= 40 ? "text-amber-700" : "text-red-600"
        } ${lang === "si" ? "sinhala" : ""}`}
      >
        {headline}
      </p>

      {/* Dimension-level notes */}
      {tips.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {tips.map((tip, i) => (
            <li
              key={i}
              className={`text-sm text-gray-600 leading-relaxed ${lang === "si" ? "sinhala" : ""}`}
            >
              <span className="mr-2 text-gray-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}

      {/* Sample Answer */}
      <div className="mt-5">
        <h4
          className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}
        >
          {lang === "si" ? "ආදර්ශ පිළිතුර" : "Sample Answer"}
        </h4>
        <div className="mt-2.5 rounded-xl border border-green-100 bg-green-50/50 p-4">
          <p className="text-sm text-green-900 leading-relaxed font-normal italic">
            &ldquo;{sampleAnswer}&rdquo;
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-5">
        <h4
          className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}
        >
          {lang === "si" ? "පැහැදිලි කිරීම" : "Explanation"}
        </h4>
        <div className="mt-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p
            className={`text-sm text-gray-700 leading-relaxed ${lang === "si" ? "sinhala font-normal" : "font-normal"}`}
          >
            {lang === "si" ? explanationSi : explanationEn}
          </p>
        </div>
      </div>
    </div>
  );
}
