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
    <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
      <h3 className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "වැරදි හරිගස්සමු" : "Let's fix the mistakes"}
      </h3>

      <div className="mt-3">
        {feedback.points.length > 0 && (
          <ul className={`space-y-2 text-sm text-gray-700 ${textClass}`}>
            {feedback.points.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {feedback.trickyNotes.length > 0 && (
          <div
            className={`space-y-2 ${feedback.points.length > 0 ? "mt-4 border-t border-primary-100 pt-4" : ""}`}
          >
            {feedback.trickyNotes.map((note) => (
              <div
                key={note.word}
                className="rounded-lg bg-white p-3 text-sm shadow-sm"
              >
                <span className="font-semibold text-primary-700">
                  {note.word}
                </span>
                <p className={`mt-1 text-gray-700 ${textClass}`}>
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
