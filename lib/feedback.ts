import type { WfdQuestion } from "./questions";
import type { ScoreResult } from "./scoring";

export type FeedbackLang = "si" | "en";

export interface Feedback {
  headline: string;
  points: string[];
  trickyNotes: { word: string; note: string }[];
}

function list(words: string[]): string {
  return words.map((w) => `“${w}”`).join(", ");
}

/**
 * Generates marker-style feedback from the user's actual mistakes.
 * Fully template-based — no AI calls in v1.
 */
export function generateFeedback(
  score: ScoreResult,
  question: WfdQuestion,
  lang: FeedbackLang
): Feedback {
  const missing = score.words
    .filter((w) => w.status === "missing")
    .map((w) => w.word);
  const misspelled = score.words.filter((w) => w.status === "misspelled");
  const extra = score.words
    .filter((w) => w.status === "extra")
    .map((w) => w.typed);

  const wrongWords = new Set([...missing, ...misspelled.map((w) => w.word)]);
  const trickyNotes = question.trickyWords
    .filter((t) => wrongWords.has(t.word))
    .map((t) => ({ word: t.word, note: lang === "si" ? t.noteSi : t.noteEn }));

  const perfect = score.correct === score.total && extra.length === 0;
  const ratio = score.correct / score.total;

  let headline: string;
  const points: string[] = [];

  if (lang === "si") {
    if (perfect) {
      headline = "නියමයි! සියලුම වචන නිවැරදියි.";
      points.push("මේ වගේම ඊළඟ ප්‍රශ්නයටත් උත්සාහ කරන්න.");
    } else if (ratio >= 0.7) {
      headline = "හොඳයි — වචන කිහිපයක් විතරයි වැරදුණේ.";
    } else {
      headline = "කමක් නැහැ — වැරදුණු වචන හොඳින් බලලා ආයෙත් උත්සාහ කරමු.";
    }

    if (missing.length > 0) {
      points.push(
        `ඔබට මඟ හැරුණු වචන: ${list(missing)}. ඊළඟ වතාවේ audio එක අහද්දී මේ වචන වලට විශේෂ අවධානය දෙන්න.`
      );
    }
    if (misspelled.length > 0) {
      points.push(
        `අක්ෂර වින්‍යාසය වැරදුණු වචන: ${misspelled
          .map((w) => `“${w.typed}” → නිවැරදි වචනය “${w.word}”`)
          .join(", ")}. PTE වලදී අකුරක් වැරදුණත් ලකුණු ලැබෙන්නේ නැහැ.`
      );
    }
    if (extra.length > 0) {
      points.push(
        `වාක්‍යයේ නැති අමතර වචන ඔබ ලියලා තියෙනවා: ${list(
          extra
        )}. ඇහුණු දේ විතරක් ලියන්න — අමුතුවෙන් වචන එකතු කරන්න එපා.`
      );
    }
  } else {
    if (perfect) {
      headline = "Perfect! Every word is correct.";
      points.push("Keep this up on the next question.");
    } else if (ratio >= 0.7) {
      headline = "Good work — only a few words went wrong.";
    } else {
      headline = "That's okay — review the words below and try again.";
    }

    if (missing.length > 0) {
      points.push(
        `Words you missed: ${list(
          missing
        )}. Listen out for these words next time.`
      );
    }
    if (misspelled.length > 0) {
      points.push(
        `Spelling mistakes: ${misspelled
          .map((w) => `“${w.typed}” → correct word is “${w.word}”`)
          .join(", ")}. In PTE, even one wrong letter loses the point.`
      );
    }
    if (extra.length > 0) {
      points.push(
        `You typed extra words that are not in the sentence: ${list(
          extra
        )}. Write only what you hear — don't add words.`
      );
    }
  }

  return { headline, points, trickyNotes };
}
