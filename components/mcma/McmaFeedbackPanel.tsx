"use client";

import type { McmaScoreResult } from "@/lib/mcmaScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function McmaFeedbackPanel({
  score,
  explanationEn,
  explanationSi,
  lang = "si",
}: {
  score: McmaScoreResult;
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
}) {
  const isPerfect = score.finalScore === score.maxScore;
  const ratio = score.finalScore / score.maxScore;

  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (isPerfect) {
      headline = "විශිෂ්ටයි! සියලුම නිවැරදි පිළිතුරු තෝරාගෙන තිබේ.";
      tips.push("ඊළඟ ප්‍රශ්නයටත් මේ වගේම හොඳින් සවන් දෙන්න.");
    } else if (score.finalScore > 0) {
      headline = "හොඳ උත්සාහයක්! නිවැරදි පිළිතුරු කිහිපයක් හඳුනාගෙන තිබේ.";
      tips.push("මඟ හැරුණු හෝ වැරදුණු පිළිතුරු පහතින් බලා ඉගෙන ගන්න.");
    } else {
      headline = "කමක් නැහැ, අපි මේකෙන් ඉගෙන ගනිමු.";
      tips.push("ඇත්තටම නිවැරදි පිළිතුරු සහ ඒවාට හේතු පහතින් බලන්න.");
    }

    if (score.incorrectSelectedCount > 0) {
      tips.push("අවධානයෙන් සවන් දෙන්න: වැරදි පිළිතුරු තේරීමෙන් ලකුණු අඩු වේ (සෘණ ලකුණු).");
    }
    tips.push("PTE MCMA ප්‍රශ්න වලදී උපරිම ලකුණු ලබාගැනීමට, 100% ක් විශ්වාස නැති පිළිතුරු තේරීමෙන් වළකින්න.");
  } else {
    if (isPerfect) {
      headline = "Excellent! You selected all correct options.";
      tips.push("Keep focusing like this on the next question.");
    } else if (score.finalScore > 0) {
      headline = "Good effort! You identified some of the correct options.";
      tips.push("Review the missed or incorrect choices below to learn.");
    } else {
      headline = "Don't worry, let's learn from this attempt.";
      tips.push("See the correct options and their reasoning below.");
    }

    if (score.incorrectSelectedCount > 0) {
      tips.push("Listen carefully: selecting incorrect choices incurs a negative penalty.");
    }
    tips.push("To maximize your score in PTE MCMA, avoid selecting options if you are not completely sure.");
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
      <h3 className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          isPerfect ? "text-green-700" : score.finalScore > 0 ? "text-primary-700" : "text-amber-700"
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
