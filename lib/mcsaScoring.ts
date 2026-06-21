import type { McsaQuestion, RmcsaQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface McsaOptionFeedback {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  status: "correct-selected" | "incorrect-selected" | "correct-missed" | "incorrect-ignored";
}

export interface McsaScoreResult {
  optionFeedbacks: McsaOptionFeedback[];
  selectedIndex: number | null;
  isCorrect: boolean;
  finalScore: number;
  maxScore: number;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score MCSA answers.
 * +1 if correct option is selected.
 * 0 if incorrect option is selected or no option selected.
 */
export function scoreMcsaAnswer(
  question: McsaQuestion | RmcsaQuestion,
  selectedIndex: number | null
): McsaScoreResult {
  const optionFeedbacks: McsaOptionFeedback[] = question.options.map((option, index) => {
    const isSelected = selectedIndex === index;
    const isCorrect = question.correctIndex === index;

    let status: McsaOptionFeedback["status"];
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

  const correctSelected = optionFeedbacks.some((o) => o.status === "correct-selected");
  const finalScore = correctSelected ? 1 : 0;

  return {
    optionFeedbacks,
    selectedIndex,
    isCorrect: correctSelected,
    finalScore,
    maxScore: 1,
  };
}
