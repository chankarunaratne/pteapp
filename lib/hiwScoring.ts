import type { HiwQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HiwWordFeedback {
  index: number;
  word: string;
  isSelected: boolean;
  isIncorrect: boolean;
  correctWord?: string;
  status: "correct-identified" | "incorrect-selected" | "missed" | "correct-ignored";
}

export interface HiwScoreResult {
  wordFeedbacks: HiwWordFeedback[];
  correctIdentifiedCount: number;
  incorrectSelectedCount: number;
  missedCount: number;
  finalScore: number;
  maxScore: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score HIW answers.
 * +1 for each correctly identified incorrect word.
 * -1 for each incorrectly selected word (false positive).
 * Total score is floor-capped at 0.
 */
export function scoreHiwAnswer(
  question: HiwQuestion,
  selectedIndices: number[]
): HiwScoreResult {
  const tokens = question.transcript.split(/\s+/);

  const wordFeedbacks: HiwWordFeedback[] = tokens.map((token, index) => {
    const isSelected = selectedIndices.includes(index);
    const incorrectItem = question.incorrectWords.find((item) => item.index === index);
    const isIncorrect = incorrectItem !== undefined;

    let status: HiwWordFeedback["status"];
    if (isSelected) {
      status = isIncorrect ? "correct-identified" : "incorrect-selected";
    } else {
      status = isIncorrect ? "missed" : "correct-ignored";
    }

    return {
      index,
      word: token,
      isSelected,
      isIncorrect,
      correctWord: incorrectItem?.correct,
      status,
    };
  });

  const correctIdentifiedCount = wordFeedbacks.filter((w) => w.status === "correct-identified").length;
  const incorrectSelectedCount = wordFeedbacks.filter((w) => w.status === "incorrect-selected").length;
  const missedCount = wordFeedbacks.filter((w) => w.status === "missed").length;

  const finalScore = Math.max(0, correctIdentifiedCount - incorrectSelectedCount);

  return {
    wordFeedbacks,
    correctIdentifiedCount,
    incorrectSelectedCount,
    missedCount,
    finalScore,
    maxScore: question.incorrectWords.length,
  };
}
