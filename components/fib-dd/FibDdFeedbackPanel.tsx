"use client";

import type { FibDdScoreResult, FibDdBlankResult } from "@/lib/fibDdScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function FibDdFeedbackPanel({
  score,
  passage,
  explanationEn,
  explanationSi,
  lang = "si",
}: {
  score: FibDdScoreResult;
  passage: string;
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
}) {
  const isPerfect = score.correctCount === score.totalBlanks;
  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (isPerfect) {
      headline = "විශිෂ්ටයි! සියලුම හිස්තැන් නිවැරදිව පුරවා ඇත.";
      tips.push("ඊළඟ ප්‍රශ්නයටත් මේ ආකාරයෙන්ම වාක්‍යයේ අර්ථය සහ ව්‍යාකරණ රටා හඳුනාගන්න.");
    } else if (score.correctCount > 0) {
      headline = "හොඳ උත්සාහයක්! පිළිතුරු කිහිපයක් නිවැරදියි.";
      tips.push("වැරදුණු හිස්තැන් (රතු පැහැයෙන් දක්වා ඇති) සඳහා නිවැරදි වචනය ඊතලයෙන් පසුව පෙන්වා ඇත.");
      tips.push("වාක්‍යයේ ක්‍රියාපද, නාමපද හෝ විශේෂණ පද අවශ්‍ය වන ස්ථාන හඳුනාගැනීමෙන් නිවැරදි වචනය තෝරාගැනීම පහසු වේ.");
    } else {
      headline = "කමක් නැහැ, අපි මේකෙන් ඉගෙන ගනිමු.";
      tips.push("පළමුව මුළු ඡේදයම කියවා එහි සන්දර්භය තේරුම් ගැනීමට උත්සාහ කරන්න.");
      tips.push("පහත දැක්වෙන නිවැරදි පිළිතුරු සහ පැහැදිලි කිරීම කියවා තේරුම් ගන්න.");
    }
  } else {
    if (isPerfect) {
      headline = "Excellent! You filled all blanks correctly.";
      tips.push("Keep focusing on sentence structure and vocabulary context.");
    } else if (score.correctCount > 0) {
      headline = "Good effort! Some of your answers are correct.";
      tips.push("Review the incorrect blanks (marked in red) along with their correct answers.");
      tips.push("Determining the missing part of speech (noun, verb, adjective) helps narrow down the options.");
    } else {
      headline = "Don't worry, let's learn from this attempt.";
      tips.push("Read the whole paragraph first to grasp the central topic.");
      tips.push("Check the correct answers and the detailed explanation below.");
    }
  }

  // Parse and render the text with visual inline corrections
  const parts = passage.split(/\{\{[^}]+\}\}/g);
  const regex = /\{\{([^}]+)\}\}/g;
  const expectedAnswers: string[] = [];
  let match;
  while ((match = regex.exec(passage)) !== null) {
    expectedAnswers.push(match[1].trim());
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}>
        {lang === "si" ? "ප්‍රතිපෝෂණය" : "Feedback"}
      </h3>

      <p
        className={`mt-2 text-sm font-medium ${
          isPerfect ? "text-green-700" : score.correctCount > 0 ? "text-primary-700" : "text-amber-700"
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

      {/* Inline Text Review */}
      <div className="mt-5">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "පෙළ විවරණය" : "Text Review"}
        </h4>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm leading-relaxed">
          <p className="text-gray-800 leading-loose text-base font-normal">
            {parts.map((part, i) => {
              const hasBlank = i < expectedAnswers.length;
              const bResult = hasBlank ? score.blanks[i] : null;

              return (
                <span key={i}>
                  <span>{part}</span>
                  {hasBlank && bResult && (
                    <span className="inline-flex flex-wrap items-center gap-1 mx-1.5 align-middle select-none">
                      {bResult.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-700 border border-green-200">
                          <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {bResult.selected}
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-700 border border-red-200">
                            <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L6.414 8H17a1 1 0 110 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4z" clipRule="evenodd" />
                            </svg>
                            {bResult.selected || (lang === "si" ? "(නොපුරවන ලද)" : "(unanswered)")}
                          </span>
                          <span className="text-xs font-bold text-gray-400">→</span>
                          <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-700 border border-green-200">
                            {bResult.expected}
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "පැහැදිලි කිරීම" : "Explanation"}
        </h4>
        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p className={`text-sm text-gray-700 leading-relaxed ${lang === "si" ? "sinhala font-normal" : "font-normal"}`}>
            {lang === "si" ? explanationSi : explanationEn}
          </p>
        </div>
      </div>
    </div>
  );
}
