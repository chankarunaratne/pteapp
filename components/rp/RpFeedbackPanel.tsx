"use client";

import type { RpScoreResult } from "@/lib/rpScoring";
import type { FeedbackLang } from "@/lib/feedback";

export default function RpFeedbackPanel({
  score,
  paragraphs,
  explanationEn,
  explanationSi,
  lang = "si",
}: {
  score: RpScoreResult;
  paragraphs: string[]; // Correctly ordered paragraphs
  explanationEn: string;
  explanationSi: string;
  lang?: FeedbackLang;
}) {
  const isPerfect = score.correctCount === score.maxScore;
  let headline = "";
  const tips: string[] = [];

  if (lang === "si") {
    if (isPerfect) {
      headline = "විශිෂ්ටයි! සියලුම ඡේද නිවැරදි පිළිවෙළට සකසා ඇත.";
      tips.push("ඊළඟ ප්‍රශ්නයටත් මේ ආකාරයෙන්ම වාක්‍ය අතර තාර්කික සම්බන්ධතා හඳුනාගන්න.");
    } else if (score.correctCount > 0) {
      headline = "හොඳ උත්සාහයක්! නිවැරදි සම්බන්ධතා කිහිපයක් හඳුනාගෙන තිබේ.";
      tips.push("ඡේද අතර වැරදුණු සම්බන්ධතා (රතු පැහැයෙන් දක්වා ඇති) අධ්‍යයනය කර නැවත උත්සාහ කරන්න.");
      tips.push("පළමු ස්වාධීන වාක්‍යය (Topic Sentence) නිවැරදිව හඳුනාගැනීම සැමවිටම වැදගත් වේ.");
    } else {
      headline = "කමක් නැහැ, අපි මේකෙන් ඉගෙන ගනිමු.";
      tips.push("සෑම ඡේදයකම ආරම්භය සහ අවසානය අතර ඇති තාර්කික හෝ ව්‍යාකරණමය සම්බන්ධතා (උදා: he/she/it, however, therefore) හඳුනා ගැනීමට උත්සාහ කරන්න.");
      tips.push("පහත දැක්වෙන නිවැරදි සම්බන්ධතා සහ පැහැදිලි කිරීම කියවා තේරුම් ගන්න.");
    }
  } else {
    if (isPerfect) {
      headline = "Excellent! All paragraphs are in the correct order.";
      tips.push("Keep practicing to quickly identify logical links between sentences.");
    } else if (score.correctCount > 0) {
      headline = "Good effort! You identified some of the correct transitions.";
      tips.push("Review the incorrect transitions (marked in red) to understand the flow.");
      tips.push("Identifying the independent topic sentence first is crucial.");
    } else {
      headline = "Don't worry, let's learn from this attempt.";
      tips.push("Look for cohesive devices like pronouns (he/she/they/this), conjuncts (however/therefore), and chronological ordering.");
      tips.push("Read the correct sequence and the detailed explanation below.");
    }
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
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

      {/* Transition analysis */}
      <div className="mt-5">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "සම්බන්ධතා විශ්ලේෂණය" : "Transition Analysis"}
        </h4>
        
        <div className="mt-3 flex flex-col gap-2">
          {score.userOrder.map((paraIdx, idx) => {
            const currentText = paragraphs[paraIdx];
            const isLast = idx === score.userOrder.length - 1;
            
            // Check if transition to next is correct
            const nextParaIdx = score.userOrder[idx + 1];
            const isTransitionCorrect = !isLast && nextParaIdx === paraIdx + 1;

            return (
              <div key={idx} className="flex flex-col">
                {/* Paragraph box */}
                <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm text-sm text-gray-800 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                      {paraIdx + 1}
                    </span>
                    <span>{currentText}</span>
                  </div>
                </div>

                {/* Transition Indicator */}
                {!isLast && (
                  <div className="my-1.5 flex items-center justify-center px-4">
                    <div className="flex-1 border-t border-dashed border-gray-200" />
                    <div
                      className={`mx-3 flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm border ${
                        isTransitionCorrect
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {isTransitionCorrect ? (
                        <>
                          <svg className="h-3 w-3 fill-current shrink-0" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{lang === "si" ? "+1 ලකුණයි" : "+1 Point"}</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3 fill-current shrink-0" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>{lang === "si" ? "වැරදි සම්බන්ධයක්" : "Incorrect Link"}</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 border-t border-dashed border-gray-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6">
        <h4 className={`text-xs font-semibold uppercase tracking-wider text-gray-400 ${lang === "si" ? "sinhala" : ""}`}>
          {lang === "si" ? "නිවැරදි අනුපිළිවෙළ සහ පැහැදිලි කිරීම" : "Correct Order & Explanation"}
        </h4>
        
        {/* Correct Order List */}
        <div className="mt-3 space-y-2 rounded-xl border border-primary-100 bg-primary-50/20 p-4">
          <p className="text-xs font-bold text-primary-700 uppercase tracking-wider">
            {lang === "si" ? "නිවැරදි පිළිවෙළ:" : "Correct Sequence:"}
          </p>
          <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700">
            {paragraphs.map((para, i) => (
              <li key={i} className="pl-1">
                {para}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <p className={`text-sm text-gray-700 leading-relaxed ${lang === "si" ? "sinhala font-normal" : "font-normal"}`}>
            {lang === "si" ? explanationSi : explanationEn}
          </p>
        </div>
      </div>
    </div>
  );
}
