import type { FibDdQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FibDdBlankResult {
  index: number;
  expected: string;
  selected: string; // Empty string if unanswered
  isCorrect: boolean;
}

export interface FibDdScoreResult {
  blanks: FibDdBlankResult[];
  correctCount: number;
  totalBlanks: number;
  finalScore: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Parses correct answers from a passage string containing {{word}} tokens.
 */
export function parseExpectedAnswers(passage: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const answers: string[] = [];
  let match;
  while ((match = regex.exec(passage)) !== null) {
    answers.push(match[1].trim());
  }
  return answers;
}

/**
 * Score FIB-DD answers.
 * +1 for each correct blank filled.
 */
export function scoreFibDdAnswer(
  question: FibDdQuestion,
  placedWords: Record<number, string> // Map of blank index -> placed word
): FibDdScoreResult {
  const expectedAnswers = parseExpectedAnswers(question.passage);
  const totalBlanks = expectedAnswers.length;

  const blanks: FibDdBlankResult[] = expectedAnswers.map((expected, idx) => {
    const selected = (placedWords[idx] ?? "").trim();
    return {
      index: idx,
      expected,
      selected,
      isCorrect: selected === expected,
    };
  });

  const correctCount = blanks.filter((b) => b.isCorrect).length;

  return {
    blanks,
    correctCount,
    totalBlanks,
    finalScore: correctCount,
  };
}
