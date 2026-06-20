import type { FeedbackLang } from "@/lib/feedback";
import type { ScoreResult } from "@/lib/scoring";

/**
 * Two-line sentence comparison.
 *
 * Top line:  the full correct sentence in plain text.
 * Bottom line: the user's attempt with only errors highlighted inline.
 *
 * Error styles are intentionally minimal — just enough colour to draw the eye
 * without the cognitive overhead of a full colour-coded legend.
 */
export default function WordDiff({ score, lang }: { score: ScoreResult; lang: FeedbackLang }) {
  // Build the correct sentence from target words (preserving order).
  const correctWords = score.words
    .filter((w) => w.status !== "extra")
    .map((w) => w.word);

  // Build the user's attempt tokens with error annotations.
  const userTokens = score.words.map((w, idx) => {
    switch (w.status) {
      case "correct":
        return (
          <span key={idx} className="text-gray-700">
            {w.word}
          </span>
        );
      case "misspelled":
        return (
          <span
            key={idx}
            className="rounded bg-amber-100 px-0.5 text-amber-800"
            title={`Should be "${w.word}"`}
          >
            {w.typed}
          </span>
        );
      case "missing":
        return (
          <span
            key={idx}
            className="border-b-2 border-dashed border-red-300 px-0.5 text-red-400"
          >
            {w.word}
          </span>
        );
      case "extra":
        return (
          <span
            key={idx}
            className="rounded bg-gray-100 px-0.5 text-gray-400 line-through"
          >
            {w.typed}
          </span>
        );
    }
  });

  const isSi = lang === "si";
  const labelClass = `shrink-0 min-w-[5rem] text-gray-500 ${
    isSi
      ? "text-sm font-normal sinhala pt-0.5"
      : "text-xs font-semibold uppercase tracking-wide pt-0.5"
  }`;

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {/* Correct sentence */}
      <div className="flex gap-3">
        <span className={labelClass}>
          {isSi ? "නිවැරදි" : "Correct"}
        </span>
        <p className="text-gray-700">{correctWords.join(" ")}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200" />

      {/* User's attempt with inline error highlights */}
      <div className="flex gap-3">
        <span className={labelClass}>
          {isSi ? "ඔබේ පිළිතුර" : "Yours"}
        </span>
        <p className="flex flex-wrap gap-x-1.5 gap-y-0.5">
          {userTokens}
        </p>
      </div>
    </div>
  );
}
