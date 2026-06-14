"use client";

import type { HiwScoreResult } from "@/lib/hiwScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function HiwFeedbackPanel({
  score,
  lang = "si",
}: {
  score: HiwScoreResult;
  lang?: FeedbackLang;
}) {
  const incorrectWords = score.wordFeedbacks.filter((w) => w.isIncorrect);
  const falseSelections = score.wordFeedbacks.filter((w) => w.status === "incorrect-selected");

  const ratio = score.finalScore / score.maxScore;
  const isPerfect = score.finalScore === score.maxScore;

  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (isPerfect) {
      headline = "විශිෂ්ටයි! සියලුම වැරදි වචන නිවැරදිව හඳුනාගත්තා.";
      tips.push("ඊළඟ ප්‍රශ්නයටත් මේ වගේම හොඳින් සවන් දෙන්න.");
    } else if (ratio >= 0.7) {
      headline = "හොඳ උත්සාහයක්! බොහෝ වැරදි වචන හඳුනාගෙන තිබේ.";
      tips.push("මඟ හැරුණු වචන සහ නිවැරදිව ශබ්ද කළ වචන පහතින් බලා ඉගෙන ගන්න.");
    } else {
      headline = "කමක් නැහැ, අපි මේකෙන් ඉගෙන ගනිමු.";
      tips.push("ඇත්තටම ඇහුණු වචනය සහ ලියා තිබූ වචනය අතර වෙනස හොඳින් සංසන්දනය කරන්න.");
    }

    if (score.incorrectSelectedCount > 0) {
      tips.push("අවධානයෙන් සවන් දෙන්න: ඇත්තටම නිවැරදි වචන ක්ලික් කිරීමෙන් ලකුණු අඩු වේ (සෘණ ලකුණු).");
    }
  } else {
    if (isPerfect) {
      headline = "Excellent! You identified all incorrect words.";
      tips.push("Keep focusing like this on the next question.");
    } else if (ratio >= 0.7) {
      headline = "Good effort! You spotted most of the differences.";
      tips.push("Review the missed words and their spoken counterparts below.");
    } else {
      headline = "Don't worry, let's learn from this attempt.";
      tips.push("Compare what was written against what was actually spoken.");
    }

    if (score.incorrectSelectedCount > 0) {
      tips.push("Listen carefully: clicking correct words incurs a negative penalty.");
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-6 -mx-6 px-6">
      <h3 className={`text-sm font-semibold text-slate-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          isPerfect ? "text-green-700" : ratio >= 0.7 ? "text-brand-700" : "text-amber-700"
        } ${lang === "si" ? "sinhala" : ""}`}
      >
        {headline}
      </p>

      {tips.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {tips.map((tip, i) => (
            <li
              key={i}
              className={`text-sm text-slate-600 leading-relaxed ${lang === "si" ? "sinhala" : ""}`}
            >
              <span className="mr-2 text-slate-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}

      {/* Comparisons */}
      <div className="mt-5">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-slate-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "වචන සංසන්දනය" : "Word Comparisons"}
        </h4>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">{lang === "si" ? "පිටපතේ තිබූ වචනය" : "Written word"}</th>
                  <th className="px-4 py-3">{lang === "si" ? "ඇත්තටම ඇසුණු වචනය" : "Spoken word"}</th>
                  <th className="px-4 py-3">{lang === "si" ? "ප්‍රතිඵලය" : "Your Result"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incorrectWords.map((w) => {
                  const wasFound = w.status === "correct-identified";
                  return (
                    <tr key={w.index} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{w.word}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium text-emerald-600">
                        {w.correctWord}
                      </td>
                      <td className="px-4 py-3">
                        {wasFound ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                            ✓ {lang === "si" ? "හඳුනාගත්තා" : "Found"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            ✗ {lang === "si" ? "මඟහැරුණා" : "Missed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Show false positive selections if any */}
                {falseSelections.map((w) => (
                  <tr key={w.index} className="bg-rose-50/20 hover:bg-rose-50/40">
                    <td className="px-4 py-3 font-medium text-slate-900">{w.word}</td>
                    <td className="px-4 py-3 text-slate-400 italic">
                      {lang === "si" ? "නිවැරදි වචනයකි" : "Correct word"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        ✗ {lang === "si" ? "වැරදි තේරීමක්" : "Incorrectly selected"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
