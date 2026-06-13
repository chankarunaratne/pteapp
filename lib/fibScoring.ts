import type { FibQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FibBlankResult {
  /** The expected word (from the passage). */
  expected: string;
  /** What the user typed (trimmed). */
  typed: string;
  /** Whether the answer matches (case-insensitive). */
  correct: boolean;
}

export interface FibScoreResult {
  blanks: FibBlankResult[];
  correctCount: number;
  totalBlanks: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Extract the ordered list of expected blank words from a passage string. */
export function extractBlanks(passage: string): string[] {
  const matches = passage.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(2, -2));
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score FIB answers. Each blank is compared individually — case-insensitive,
 * trimmed, exact match.
 */
export function scoreFibAnswer(
  question: FibQuestion,
  answers: string[]
): FibScoreResult {
  const expected = extractBlanks(question.passage);
  const blanks: FibBlankResult[] = expected.map((word, i) => {
    const typed = (answers[i] ?? "").trim();
    return {
      expected: word,
      typed,
      correct: typed.toLowerCase() === word.toLowerCase(),
    };
  });

  return {
    blanks,
    correctCount: blanks.filter((b) => b.correct).length,
    totalBlanks: blanks.length,
  };
}
