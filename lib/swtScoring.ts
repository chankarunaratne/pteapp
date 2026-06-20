import type { SwtQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SwtScoreDimension {
  label: string;
  labelSi: string;
  score: number;
  maxScore: number;
  note: string;
  noteSi: string;
}

export interface SwtScoreResult {
  wordCount: number;
  isWithinLimit: boolean;
  isSingleSentence: boolean;
  dimensions: SwtScoreDimension[];
  finalScore: number;
  maxScore: number;
  percentage: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Very rough sentence count — splits on . ! ? followed by space or end. */
function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const endings = trimmed.match(/[.!?]+(?:\s|$)/g);
  return endings ? endings.length : (trimmed.length > 0 ? 1 : 0);
}

/** Normalise a word for comparison: lowercase, strip punctuation. */
function normalise(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score a Summarize Written Text answer.
 *
 * PTE scoring criteria (simplified for practice):
 * - Content  (0–2): How many key points from the passage are covered
 * - Form     (0–1): Single sentence, 5–75 words
 * - Grammar  (0–2): Basic structural checks
 * - Vocabulary (0–2): Lexical variety & use of passage vocabulary
 *
 * Max total: 7
 */
export function scoreSwtAnswer(
  question: SwtQuestion,
  answer: string
): SwtScoreResult {
  const trimmed = answer.trim();
  const wordCount = countWords(trimmed);
  const sentenceCount = countSentences(trimmed);
  const isWithinLimit = wordCount >= 5 && wordCount <= 75;
  const isSingleSentence = sentenceCount <= 1;

  // ── Content (0–2) ─────────────────────────────────────────────
  const answerWords = new Set(
    trimmed.split(/\s+/).map(normalise).filter(Boolean)
  );
  const matchedKeyPoints = question.keyPoints.filter((kp) => {
    const kpWords = kp.toLowerCase().split(/\s+/);
    return kpWords.every((w) => answerWords.has(normalise(w)));
  });
  const keyPointRatio = question.keyPoints.length > 0
    ? matchedKeyPoints.length / question.keyPoints.length
    : 0;
  let contentScore: number;
  if (keyPointRatio >= 0.45) contentScore = 2;
  else if (keyPointRatio >= 0.2) contentScore = 1;
  else contentScore = 0;

  let contentNote: string;
  let contentNoteSi: string;
  if (contentScore === 2) {
    contentNote = `Excellent — you captured ${matchedKeyPoints.length} of ${question.keyPoints.length} key concepts from the passage.`;
    contentNoteSi = `විශිෂ්ටයි — ඡේදයේ ප්‍රධාන සංකල්ප ${question.keyPoints.length} න් ${matchedKeyPoints.length} ක් ඔබ ග්‍රහණය කර ඇත.`;
  } else if (contentScore === 1) {
    contentNote = `You mentioned some key points (${matchedKeyPoints.length}/${question.keyPoints.length}). Try to include more core ideas.`;
    contentNoteSi = `ප්‍රධාන කරුණු කිහිපයක් (${matchedKeyPoints.length}/${question.keyPoints.length}) ඇතුළත් කර ඇත. තවත් මූලික අදහස් ඇතුළත් කරන්න උත්සාහ කරන්න.`;
  } else {
    contentNote = `Only ${matchedKeyPoints.length} key concepts captured. Re-read the passage and identify the main ideas.`;
    contentNoteSi = `ප්‍රධාන සංකල්ප ${matchedKeyPoints.length} ක් පමණක් ග්‍රහණය කර ඇත. ඡේදය නැවත කියවා ප්‍රධාන අදහස් හඳුනාගන්න.`;
  }

  // ── Form (0–1) ────────────────────────────────────────────────
  const formOk = isSingleSentence && isWithinLimit;
  const formScore = formOk ? 1 : 0;

  let formNote: string;
  let formNoteSi: string;
  if (formOk) {
    formNote = `Good form — single sentence with ${wordCount} words (limit: 75).`;
    formNoteSi = `හොඳ ආකෘතිය — වචන ${wordCount} ක් සහිත එක් වාක්‍යයක් (සීමාව: 75).`;
  } else if (!isSingleSentence && !isWithinLimit) {
    formNote = `Must be a single sentence within 5–75 words. You wrote ${sentenceCount} sentence(s) with ${wordCount} words.`;
    formNoteSi = `වචන 5–75 අතර එක් වාක්‍යයක් විය යුතුය. ඔබ වාක්‍ය ${sentenceCount} ක් සමඟ වචන ${wordCount} ක් ලිව්වා.`;
  } else if (!isSingleSentence) {
    formNote = `Must be a single sentence. You wrote ${sentenceCount} sentences.`;
    formNoteSi = `එක් වාක්‍යයක් විය යුතුය. ඔබ වාක්‍ය ${sentenceCount} ක් ලිව්වා.`;
  } else {
    formNote = `Word count must be 5–75. You wrote ${wordCount} words.`;
    formNoteSi = `වචන ගණන 5–75 අතර විය යුතුය. ඔබ වචන ${wordCount} ක් ලිව්වා.`;
  }

  // ── Grammar (0–2) ─────────────────────────────────────────────
  // Simple heuristic: starts with capital, ends with period, reasonable length
  const startsWithCapital = /^[A-Z]/.test(trimmed);
  const endsWithPunctuation = /[.!?]$/.test(trimmed);
  let grammarScore = 2;
  const grammarIssues: string[] = [];
  const grammarIssuesSi: string[] = [];

  if (!startsWithCapital) {
    grammarScore -= 1;
    grammarIssues.push("Sentence should start with a capital letter.");
    grammarIssuesSi.push("වාක්‍යය ලොකු අකුරකින් ආරම්භ විය යුතුය.");
  }
  if (!endsWithPunctuation) {
    grammarScore -= 1;
    grammarIssues.push("Sentence should end with a period (.), exclamation mark (!), or question mark (?).");
    grammarIssuesSi.push("වාක්‍යය තිතක (.), විස්මය ලකුණක (!), හෝ ප්‍රශ්න ලකුණක (?) අවසන් විය යුතුය.");
  }
  if (wordCount < 5 && wordCount > 0) {
    grammarScore = Math.max(0, grammarScore - 1);
    grammarIssues.push("Sentence is too short to demonstrate grammar skills.");
    grammarIssuesSi.push("වාක්‍යය ව්‍යාකරණ කුසලතා පෙන්වීමට කෙටි වැඩියි.");
  }
  grammarScore = Math.max(0, grammarScore);

  const grammarNote = grammarScore === 2
    ? "Good grammar structure detected."
    : grammarIssues.join(" ");
  const grammarNoteSi = grammarScore === 2
    ? "හොඳ ව්‍යාකරණ ව්‍යුහයක් හඳුනාගත හැක."
    : grammarIssuesSi.join(" ");

  // ── Vocabulary (0–2) ──────────────────────────────────────────
  // Measure unique word ratio and passage-vocabulary usage
  const uniqueWords = new Set(
    trimmed.split(/\s+/).map(normalise).filter(Boolean)
  );
  const uniqueRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  // Count passage-derived words used (excluding very common words)
  const commonWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "must", "to", "of", "in",
    "for", "on", "with", "at", "by", "from", "as", "into", "through",
    "during", "before", "after", "above", "below", "between", "and", "but",
    "or", "not", "so", "if", "than", "that", "this", "these", "those",
    "it", "its", "they", "them", "their", "he", "she", "his", "her",
    "we", "our", "you", "your", "who", "which", "what", "where", "when",
  ]);
  const passageWords = new Set(
    question.passage.split(/\s+/).map(normalise).filter((w) => w && !commonWords.has(w))
  );
  const passageOverlap = [...uniqueWords].filter((w) => passageWords.has(w)).length;

  let vocabScore: number;
  if (uniqueRatio >= 0.7 && passageOverlap >= 4) vocabScore = 2;
  else if (uniqueRatio >= 0.5 && passageOverlap >= 2) vocabScore = 1;
  else vocabScore = wordCount === 0 ? 0 : 1;

  let vocabNote: string;
  let vocabNoteSi: string;
  if (vocabScore === 2) {
    vocabNote = "Good vocabulary range with appropriate use of passage terminology.";
    vocabNoteSi = "ඡේදයේ පාරිභාෂික වචන නිසි පරිදි භාවිතා කරමින් හොඳ වචන පරාසයක් පෙන්නුම් කරයි.";
  } else if (vocabScore === 1) {
    vocabNote = "Try to use more varied vocabulary and include key terms from the passage.";
    vocabNoteSi = "වඩාත් විවිධ වචන මාලාවක් භාවිතා කරන්න සහ ඡේදයේ ප්‍රධාන පද ඇතුළත් කරන්න.";
  } else {
    vocabNote = "Very limited vocabulary. Use key terms from the passage in your summary.";
    vocabNoteSi = "ඉතා සීමිත වචන මාලාවක්. ඔබේ සාරාංශයේ ඡේදයෙන් ප්‍රධාන පද භාවිතා කරන්න.";
  }

  // ── Aggregate ─────────────────────────────────────────────────
  const dimensions: SwtScoreDimension[] = [
    {
      label: "Content",
      labelSi: "අන්තර්ගතය",
      score: contentScore,
      maxScore: 2,
      note: contentNote,
      noteSi: contentNoteSi,
    },
    {
      label: "Form",
      labelSi: "ආකෘතිය",
      score: formScore,
      maxScore: 1,
      note: formNote,
      noteSi: formNoteSi,
    },
    {
      label: "Grammar",
      labelSi: "ව්‍යාකරණය",
      score: grammarScore,
      maxScore: 2,
      note: grammarNote,
      noteSi: grammarNoteSi,
    },
    {
      label: "Vocabulary",
      labelSi: "වචන මාලාව",
      score: vocabScore,
      maxScore: 2,
      note: vocabNote,
      noteSi: vocabNoteSi,
    },
  ];

  const finalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  const maxScore = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0;

  return {
    wordCount,
    isWithinLimit,
    isSingleSentence,
    dimensions,
    finalScore,
    maxScore,
    percentage,
  };
}
