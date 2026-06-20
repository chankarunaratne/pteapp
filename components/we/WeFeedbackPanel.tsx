"use client";

import type { WeScoreResult } from "@/lib/weScoring";
import type { FeedbackLang } from "@/lib/feedback";
import { useState } from "react";

export default function WeFeedbackPanel({
  score,
  sampleAnswer,
  explanationEn,
  explanationSi,
  lang = "si",
}: {
  score: WeScoreResult;
  sampleAnswer: string;
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
}) {
  const pct = score.percentage;
  const [showSample, setShowSample] = useState(false);

  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (pct >= 70) {
      headline = "විශිෂ්ටයි! ඔබේ රචනාව ප්‍රධාන කරුණු හොඳින් ආවරණය කරයි.";
    } else if (pct >= 40) {
      headline = "හොඳ උත්සාහයක්, නමුත් ව්‍යුහය සහ අන්තර්ගතය වැඩිදියුණු කළ හැකිය.";
    } else {
      headline = "කමක් නැහැ — පහත ප්‍රතිපෝෂණය කියවා නැවත උත්සාහ කරන්න.";
    }
  } else {
    if (pct >= 70) {
      headline = "Excellent! Your essay covers the main points well.";
    } else if (pct >= 40) {
      headline = "Good effort, but structure and content could be improved.";
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
      "PTE WE ප්‍රශ්නවලදී ඔබේ රචනාව වචන 200–300 අතර විය යුතු අතර පැහැදිලි හැඳින්වීමක්, ශරීරයක් සහ නිගමනයක් තිබිය යුතුය."
    );
  } else {
    tips.push(
      "In PTE Write Essay, your response must be 200–300 words with a clear introduction, body paragraphs, and conclusion."
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
        <button
          type="button"
          onClick={() => setShowSample((v) => !v)}
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition ${
            lang === "si" ? "sinhala" : ""
          } ${
            showSample
              ? "text-primary-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`h-3.5 w-3.5 transition-transform ${showSample ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {lang === "si" ? "ආදර්ශ රචනාව" : "Sample Essay"}
        </button>
        {showSample && (
          <div className="mt-2.5 rounded-xl border border-green-100 bg-green-50/50 p-4 animate-feedback-reveal">
            {sampleAnswer.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-sm text-green-900 leading-relaxed font-normal italic [&:not(:first-child)]:mt-3"
              >
                {i === 0 ? "\u201C" : ""}
                {paragraph}
                {i === sampleAnswer.split("\n\n").length - 1 ? "\u201D" : ""}
              </p>
            ))}
          </div>
        )}
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
