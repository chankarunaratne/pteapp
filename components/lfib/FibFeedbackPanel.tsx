"use client";

import type { FibScoreResult } from "@/lib/fibScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function FibFeedbackPanel({
  score,
  lang = "si",
}: {
  score: FibScoreResult;
  lang?: FeedbackLang;
}) {
  const missed = score.blanks.filter((b) => !b.correct);
  const isPerfect = missed.length === 0;
  const ratio = score.correctCount / score.totalBlanks;

  let headline: string;
  const points: string[] = [];

  if (lang === "si") {
    if (isPerfect) {
      headline = "නියමයි! සියලුම හිස්තැන් නිවැරදියි.";
      points.push("මේ වගේම ඊළඟ ප්‍රශ්නයටත් උත්සාහ කරන්න.");
    } else if (ratio >= 0.7) {
      headline = "හොඳයි — හිස්තැන් කිහිපයක් විතරයි වැරදුණේ.";
    } else {
      headline = "කමක් නැහැ — වැරදුණු වචන හොඳින් බලලා ආයෙත් උත්සාහ කරමු.";
    }

    if (missed.length > 0) {
      points.push(
        `ඔබට වැරදුණු වචන: ${missed
          .map((b) =>
            b.typed
              ? `"${b.typed}" → නිවැරදි වචනය "${b.expected}"`
              : `හිස්තැනක් හිස්ව තැබුවා — නිවැරදි වචනය "${b.expected}"`
          )
          .join(", ")}.`
      );
      points.push(
        "Audio එක අහද්දී මඟ හැරෙන වචන වලට විශේෂ අවධානය දෙන්න. වචනය ඇහෙන විට ම ඇතුළත් කරන්න."
      );
    }
  } else {
    if (isPerfect) {
      headline = "Perfect! Every blank is correct.";
      points.push("Keep this up on the next question.");
    } else if (ratio >= 0.7) {
      headline = "Good work — only a few blanks went wrong.";
    } else {
      headline = "That's okay — review the blanks below and try again.";
    }

    if (missed.length > 0) {
      points.push(
        `Incorrect blanks: ${missed
          .map((b) =>
            b.typed
              ? `"${b.typed}" → correct word is "${b.expected}"`
              : `left blank → correct word is "${b.expected}"`
          )
          .join(", ")}.`
      );
      points.push(
        "Pay close attention to the words around each blank — they'll help you predict what's coming. Type the word as soon as you hear it."
      );
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-6 -mx-6 px-6">
      <h3
        className={`text-sm font-semibold text-slate-900 ${
          lang === "si" ? "sinhala" : ""
        }`}
      >
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          isPerfect ? "text-green-700" : ratio >= 0.7 ? "text-brand-700" : "text-amber-700"
        } ${lang === "si" ? "sinhala" : ""}`}
      >
        {headline}
      </p>

      {points.length > 0 && (
        <ul className="mt-3 space-y-2">
          {points.map((point, i) => (
            <li
              key={i}
              className={`text-sm text-slate-600 leading-relaxed ${
                lang === "si" ? "sinhala" : ""
              }`}
            >
              <span className="mr-2 text-slate-400">•</span>
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
