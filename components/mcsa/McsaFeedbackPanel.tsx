"use client";

import type { McsaScoreResult } from "@/lib/mcsaScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function McsaFeedbackPanel({
  score,
  explanationEn,
  explanationSi,
  lang = "si",
  type = "listening",
}: {
  score: McsaScoreResult;
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
  type?: "reading" | "listening";
}) {
  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (score.isCorrect) {
      headline = "විශිෂ්ටයි! නිවැරදි පිළිතුර තෝරාගෙන තිබේ.";
      tips.push(
        type === "listening"
          ? "ඊළඟ ප්‍රශ්නයටත් මේ වගේම හොඳින් සවන් දෙන්න."
          : "ඊළඟ ප්‍රශ්නයටත් මේ වගේම හොඳින් අවධානය යොමු කරන්න."
      );
    } else {
      headline = "කමක් නැහැ, අපි මේකෙන් ඉගෙන ගනිමු.";
      tips.push("පහතින් ඇති නිවැරදි පිළිතුර සහ පැහැදිලි කිරීම හොඳින් බලන්න.");
    }
    tips.push("PTE Multiple Choice, Single Answer ප්‍රශ්න වලදී වැරදි පිළිතුරු සඳහා සෘණ ලකුණු (negative marks) ලැබෙන්නේ නැත. එබැවින් සැමවිටම පිළිතුරක් තෝරන්න.");
  } else {
    if (score.isCorrect) {
      headline = "Excellent! You selected the correct option.";
      tips.push("Keep focusing like this on the next question.");
    } else {
      headline = "Don't worry, let's learn from this attempt.";
      tips.push("Review the correct option and the explanation below.");
    }
    tips.push("For MCSA questions, there is no negative penalty for incorrect choices. Make sure to always guess if you are unsure.");
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
      <h3 className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          score.isCorrect ? "text-green-700" : "text-amber-700"
        } ${lang === "si" ? "sinhala" : ""}`}
      >
        {headline}
      </p>

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

      {/* Explanation */}
      <div className="mt-5">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "පැහැදිලි කිරීම" : "Explanation"}
        </h4>
        <div className="mt-2.5 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p className={`text-sm text-gray-700 leading-relaxed ${lang === "si" ? "sinhala font-normal" : "font-normal"}`}>
            {lang === "si" ? explanationSi : explanationEn}
          </p>
        </div>
      </div>
    </div>
  );
}
