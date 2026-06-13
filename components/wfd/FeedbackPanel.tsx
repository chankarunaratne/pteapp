"use client";

import { generateFeedback, type FeedbackLang } from "@/lib/feedback";
import type { WfdQuestion } from "@/lib/questions";
import type { ScoreResult } from "@/lib/scoring";

interface Props {
  score: ScoreResult;
  question: WfdQuestion;
  lang: FeedbackLang;
}

export default function FeedbackPanel({ score, question, lang }: Props) {
  const feedback = generateFeedback(score, question, lang);
  const textClass = lang === "si" ? "sinhala" : "";

  const hasContent =
    feedback.points.length > 0 || feedback.trickyNotes.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      <h3 className={`text-sm font-semibold text-slate-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "වැරදි හරිගස්සමු" : "Let's fix the mistakes"}
      </h3>

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
