import type { RpQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RpPairResult {
  first: string;
  second: string;
  isCorrect: boolean;
}

export interface RpScoreResult {
  userOrder: number[]; // Indices of paragraphs in user's order
  correctOrder: number[]; // Indices: [0, 1, 2, ...]
  pairs: RpPairResult[];
  correctCount: number;
  maxScore: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score Reorder Paragraph answers.
 * In PTE, scoring is based on correct adjacent pairs:
 * - If correct order is A-B-C-D-E, the correct pairs are: AB, BC, CD, DE.
 * - Each correct adjacent pair of paragraphs gets 1 point.
 * - Maximum points is N - 1.
 */
export function scoreRpAnswer(
  question: RpQuestion,
  userOrder: number[] // array of indices
): RpScoreResult {
  const correctOrder = Array.from({ length: question.paragraphs.length }, (_, i) => i);
  const maxScore = Math.max(0, question.paragraphs.length - 1);
  const pairs: RpPairResult[] = [];
  let correctCount = 0;

  for (let i = 0; i < userOrder.length - 1; i++) {
    const firstIdx = userOrder[i];
    const secondIdx = userOrder[i + 1];

    // In the correct order, does secondIdx immediately follow firstIdx?
    // Since paragraphs are defined in correct order, this is true if secondIdx === firstIdx + 1.
    const isCorrect = secondIdx === firstIdx + 1;

    if (isCorrect) {
      correctCount++;
    }

    pairs.push({
      first: question.paragraphs[firstIdx],
      second: question.paragraphs[secondIdx],
      isCorrect,
    });
  }

  return {
    userOrder,
    correctOrder,
    pairs,
    correctCount,
    maxScore,
  };
}
