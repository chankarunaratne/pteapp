import type { RfibQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RfibBlankResult {
  /** The expected (correct) word. */
  expected: string;
  /** What the user selected (empty string if unanswered). */
  selected: string;
  /** Whether the selection matches the correct answer. */
  correct: boolean;
}

export interface RfibScoreResult {
  blanks: RfibBlankResult[];
  correctCount: number;
  totalBlanks: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score Reading FIB (Dropdown) answers.
 * Each blank is compared individually — exact match.
 */
export function scoreRfibAnswer(
  question: RfibQuestion,
  selections: string[]
): RfibScoreResult {
  const blanks: RfibBlankResult[] = question.blanks.map((blank, i) => {
    const selected = (selections[i] ?? "").trim();
    return {
      expected: blank.answer,
      selected,
      correct: selected === blank.answer,
    };
  });

  return {
    blanks,
    correctCount: blanks.filter((b) => b.correct).length,
    totalBlanks: blanks.length,
  };
}
