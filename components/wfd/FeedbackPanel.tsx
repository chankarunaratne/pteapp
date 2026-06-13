"use client";

import { generateFeedback, type FeedbackLang } from "@/lib/feedback";
import type { WfdQuestion } from "@/lib/questions";
import type { ScoreResult } from "@/lib/scoring";

interface Props {
  score: ScoreResult;
  question: WfdQuestion;
  lang: FeedbackLang;
  onLangChange: (lang: FeedbackLang) => void;
}

export default function FeedbackPanel({
  score,
  question,
  lang,
  onLangChange,
}: Props) {
  const feedback = generateFeedback(score, question, lang);
  const textClass = lang === "si" ? "sinhala" : "";

  const hasContent =
    feedback.points.length > 0 || feedback.trickyNotes.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Detailed explanation
        </h3>
        <div
          className="flex shrink-0 overflow-hidden rounded-lg border border-slate-300 text-xs font-semibold"
          role="group"
          aria-label="Feedback language"
        >
          <button
            type="button"
            onClick={() => onLangChange("si")}
            className={`sinhala px-3 py-1.5 transition ${
              lang === "si"
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            සිංහල
          </button>
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`px-3 py-1.5 transition ${
              lang === "en"
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
        {feedback.points.length > 0 && (
          <ul className={`space-y-2 text-sm text-slate-700 ${textClass}`}>
            {feedback.points.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {feedback.trickyNotes.length > 0 && (
          <div
            className={`space-y-2 ${feedback.points.length > 0 ? "mt-4 border-t border-brand-100 pt-4" : ""}`}
          >
            {feedback.trickyNotes.map((note) => (
              <div
                key={note.word}
                className="rounded-lg bg-white p-3 text-sm shadow-sm"
              >
                <span className="font-semibold text-brand-700">
                  {note.word}
                </span>
                <p className={`mt-1 text-slate-700 ${textClass}`}>
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
