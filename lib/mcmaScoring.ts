import type { McmaQuestion, RmcmaQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface McmaOptionFeedback {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  status: "correct-selected" | "incorrect-selected" | "correct-missed" | "incorrect-ignored";
}

export interface McmaScoreResult {
  optionFeedbacks: McmaOptionFeedback[];
  correctSelectedCount: number;
  incorrectSelectedCount: number;
  missedCorrectCount: number;
  finalScore: number;
  maxScore: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score MCMA answers.
 * +1 for each correct option selected.
 * -1 for each incorrect option selected.
 * Total score is floor-capped at 0.
 */
export function scoreMcmaAnswer(
  question: McmaQuestion | RmcmaQuestion,
  selectedIndices: number[]
): McmaScoreResult {
  const optionFeedbacks: McmaOptionFeedback[] = question.options.map((option, index) => {
    const isSelected = selectedIndices.includes(index);
    const isCorrect = question.correctIndices.includes(index);

    let status: McmaOptionFeedback["status"];
    if (isSelected) {
      status = isCorrect ? "correct-selected" : "incorrect-selected";
    } else {
      status = isCorrect ? "correct-missed" : "incorrect-ignored";
    }

    return {
      option,
      index,
      isSelected,
      isCorrect,
      status,
    };
  });

  const correctSelectedCount = optionFeedbacks.filter((o) => o.status === "correct-selected").length;
  const incorrectSelectedCount = optionFeedbacks.filter((o) => o.status === "incorrect-selected").length;
  const missedCorrectCount = optionFeedbacks.filter((o) => o.status === "correct-missed").length;

  const finalScore = Math.max(0, correctSelectedCount - incorrectSelectedCount);

  return {
    optionFeedbacks,
    correctSelectedCount,
    incorrectSelectedCount,
    missedCorrectCount,
    finalScore,
    maxScore: question.correctIndices.length,
  };
}
