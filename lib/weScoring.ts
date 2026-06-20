import type { WeQuestion } from "./questions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WeScoreDimension {
  label: string;
  labelSi: string;
  score: number;
  maxScore: number;
  note: string;
  noteSi: string;
}

export interface WeScoreResult {
  wordCount: number;
  isWithinRange: boolean;
  dimensions: WeScoreDimension[];
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

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const endings = trimmed.match(/[.!?]+(?:\s|$)/g);
  return endings ? endings.length : trimmed.length > 0 ? 1 : 0;
}

function normalise(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function countParagraphs(text: string): number {
  return text
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/**
 * Score a Write Essay answer.
 *
 * PTE scoring criteria (simplified for practice):
 * - Content            (0–3): Topic relevance & key point coverage
 * - Form               (0–2): 200–300 words
 * - Development/Structure (0–2): Paragraphs, intro/body/conclusion
 * - Grammar            (0–2): Basic structural checks
 * - Vocabulary         (0–2): Lexical variety
 * - Spelling           (0–2): Heuristic check
 * - Linguistic Range   (0–2): Sentence variety & connectors
 *
 * Max total: 15
 */
export function scoreWeAnswer(
  question: WeQuestion,
  answer: string
): WeScoreResult {
  const trimmed = answer.trim();
  const wordCount = countWords(trimmed);
  const sentenceCount = countSentences(trimmed);
  const paragraphCount = countParagraphs(trimmed);
  const isWithinRange = wordCount >= 200 && wordCount <= 300;

  // ── Content (0–3) ─────────────────────────────────────────────
  const answerWords = new Set(
    trimmed.split(/\s+/).map(normalise).filter(Boolean)
  );
  const matchedKeyPoints = question.keyPoints.filter((kp) => {
    const kpWords = kp.toLowerCase().split(/\s+/);
    return kpWords.every((w) => answerWords.has(normalise(w)));
  });
  const keyPointRatio =
    question.keyPoints.length > 0
      ? matchedKeyPoints.length / question.keyPoints.length
      : 0;

  let contentScore: number;
  if (keyPointRatio >= 0.5) contentScore = 3;
  else if (keyPointRatio >= 0.3) contentScore = 2;
  else if (keyPointRatio >= 0.15) contentScore = 1;
  else contentScore = 0;

  let contentNote: string;
  let contentNoteSi: string;
  if (contentScore === 3) {
    contentNote = `Excellent topic coverage — you addressed ${matchedKeyPoints.length} of ${question.keyPoints.length} key aspects.`;
    contentNoteSi = `විශිෂ්ට මාතෘකා ආවරණයක් — ප්‍රධාන අංශ ${question.keyPoints.length} න් ${matchedKeyPoints.length} ක් ආමන්ත්‍රණය කර ඇත.`;
  } else if (contentScore >= 1) {
    contentNote = `You touched on some relevant points (${matchedKeyPoints.length}/${question.keyPoints.length}). Try to address more aspects of the topic.`;
    contentNoteSi = `අදාළ කරුණු කිහිපයක් ස්පර්ශ කර ඇත (${matchedKeyPoints.length}/${question.keyPoints.length}). මාතෘකාවේ තවත් අංශ ආමන්ත්‍රණය කරන්න උත්සාහ කරන්න.`;
  } else {
    contentNote = `Limited topic relevance. Make sure your essay directly addresses the given prompt.`;
    contentNoteSi = `සීමිත මාතෘකා අදාළතාවයක්. ඔබේ රචනාව ලබා දී ඇති ප්‍රේරකයට කෙලින්ම ආමන්ත්‍රණය කරන බවට සහතික වන්න.`;
  }

  // ── Form (0–2) ────────────────────────────────────────────────
  let formScore: number;
  if (isWithinRange) formScore = 2;
  else if (wordCount >= 120 && wordCount <= 380) formScore = 1;
  else formScore = 0;

  let formNote: string;
  let formNoteSi: string;
  if (formScore === 2) {
    formNote = `Good form — ${wordCount} words (target: 200–300).`;
    formNoteSi = `හොඳ ආකෘතිය — වචන ${wordCount} ක් (ඉලක්කය: 200–300).`;
  } else if (formScore === 1) {
    formNote = `Word count is ${wordCount}. Aim for 200–300 words for full marks.`;
    formNoteSi = `වචන ගණන ${wordCount} ක්. සම්පූර්ණ ලකුණු සඳහා වචන 200–300 ඉලක්ක කරන්න.`;
  } else {
    formNote = `Word count is ${wordCount}. The essay must be 200–300 words.`;
    formNoteSi = `වචන ගණන ${wordCount} ක්. රචනාව වචන 200–300 අතර විය යුතුය.`;
  }

  // ── Development / Structure (0–2) ─────────────────────────────
  const hasIntroConclusion =
    sentenceCount >= 3 && paragraphCount >= 2;
  let structureScore: number;
  if (paragraphCount >= 3 && hasIntroConclusion) structureScore = 2;
  else if (paragraphCount >= 2) structureScore = 1;
  else structureScore = wordCount === 0 ? 0 : 0;

  let structureNote: string;
  let structureNoteSi: string;
  if (structureScore === 2) {
    structureNote = `Good essay structure with ${paragraphCount} paragraphs. Clear introduction, body, and conclusion detected.`;
    structureNoteSi = `ඡේද ${paragraphCount} ක් සහිත හොඳ රචනා ව්‍යුහයක්. පැහැදිලි හැඳින්වීමක්, ශරීරයක් සහ නිගමනයක් හඳුනාගත හැක.`;
  } else if (structureScore === 1) {
    structureNote = `Some structure visible. Aim for at least 3 clear paragraphs: introduction, body, and conclusion.`;
    structureNoteSi = `යම් ව්‍යුහයක් දක්නට ලැබේ. අවම වශයෙන් පැහැදිලි ඡේද 3 ක් ඉලක්ක කරන්න: හැඳින්වීම, ශරීරය සහ නිගමනය.`;
  } else {
    structureNote = `Essay lacks clear structure. Use separate paragraphs for introduction, supporting arguments, and conclusion.`;
    structureNoteSi = `රචනාවට පැහැදිලි ව්‍යුහයක් නැත. හැඳින්වීම, සහාය තර්ක සහ නිගමනය සඳහා වෙන වෙනම ඡේද භාවිතා කරන්න.`;
  }

  // ── Grammar (0–2) ─────────────────────────────────────────────
  const startsWithCapital = /^[A-Z]/.test(trimmed);
  const endsWithPunctuation = /[.!?]$/.test(trimmed);
  let grammarScore = 2;
  const grammarIssues: string[] = [];
  const grammarIssuesSi: string[] = [];

  if (!startsWithCapital) {
    grammarScore -= 1;
    grammarIssues.push("Essay should start with a capital letter.");
    grammarIssuesSi.push("රචනාව ලොකු අකුරකින් ආරම්භ විය යුතුය.");
  }
  if (!endsWithPunctuation) {
    grammarScore -= 1;
    grammarIssues.push("Essay should end with proper punctuation.");
    grammarIssuesSi.push("රචනාව නිසි විරාම ලකුණකින් අවසන් විය යුතුය.");
  }
  if (sentenceCount < 5 && wordCount > 50) {
    grammarScore = Math.max(0, grammarScore - 1);
    grammarIssues.push(
      "Too few sentences for the word count. Vary your sentence structure."
    );
    grammarIssuesSi.push(
      "වචන ගණනට සාපේක්ෂව වාක්‍ය ඉතා අඩුයි. ඔබේ වාක්‍ය ව්‍යුහය වෙනස් කරන්න."
    );
  }
  grammarScore = Math.max(0, grammarScore);

  const grammarNote =
    grammarScore === 2
      ? "Good grammar structure detected."
      : grammarIssues.join(" ");
  const grammarNoteSi =
    grammarScore === 2
      ? "හොඳ ව්‍යාකරණ ව්‍යුහයක් හඳුනාගත හැක."
      : grammarIssuesSi.join(" ");

  // ── Vocabulary (0–2) ──────────────────────────────────────────
  const uniqueWords = new Set(
    trimmed.split(/\s+/).map(normalise).filter(Boolean)
  );
  const uniqueRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  let vocabScore: number;
  if (uniqueRatio >= 0.55 && uniqueWords.size >= 60) vocabScore = 2;
  else if (uniqueRatio >= 0.4 && uniqueWords.size >= 30) vocabScore = 1;
  else vocabScore = wordCount === 0 ? 0 : 1;

  let vocabNote: string;
  let vocabNoteSi: string;
  if (vocabScore === 2) {
    vocabNote =
      "Good vocabulary range with varied word choice.";
    vocabNoteSi =
      "විවිධ වචන තේරීම් සමඟ හොඳ වචන පරාසයක්.";
  } else {
    vocabNote =
      "Try to use more varied vocabulary. Avoid repeating the same words.";
    vocabNoteSi =
      "වඩාත් විවිධ වචන මාලාවක් භාවිතා කරන්න. එකම වචන නැවත නැවත භාවිතා නොකරන්න.";
  }

  // ── Spelling (0–2) ────────────────────────────────────────────
  // Very basic heuristic — just check for common patterns
  // In a real app, this would use a spell-checker
  let spellingScore = 2;
  let spellingNote = "No obvious spelling issues detected.";
  let spellingNoteSi = "පැහැදිලි අක්ෂර වින්‍යාස ගැටලු හඳුනාගත නොහැක.";

  // Simple check: if word count is very low, lower spelling score
  if (wordCount < 50 && wordCount > 0) {
    spellingScore = 1;
    spellingNote =
      "Essay is too short to properly assess spelling. Write more to demonstrate your skills.";
    spellingNoteSi =
      "අක්ෂර වින්‍යාසය නිසි ලෙස තක්සේරු කිරීමට රචනාව කෙටි වැඩියි.";
  }

  // ── Linguistic Range (0–2) ────────────────────────────────────
  const connectors = [
    "however",
    "moreover",
    "furthermore",
    "therefore",
    "consequently",
    "nevertheless",
    "although",
    "whereas",
    "meanwhile",
    "in addition",
    "on the other hand",
    "in conclusion",
    "firstly",
    "secondly",
    "finally",
    "for example",
    "for instance",
    "in contrast",
    "as a result",
    "in fact",
  ];
  const lowerAnswer = trimmed.toLowerCase();
  const connectorCount = connectors.filter((c) =>
    lowerAnswer.includes(c)
  ).length;

  let linguisticScore: number;
  if (connectorCount >= 4 && sentenceCount >= 6) linguisticScore = 2;
  else if (connectorCount >= 2 && sentenceCount >= 3) linguisticScore = 1;
  else linguisticScore = wordCount === 0 ? 0 : 0;

  let linguisticNote: string;
  let linguisticNoteSi: string;
  if (linguisticScore === 2) {
    linguisticNote = `Good use of discourse markers (${connectorCount} found). Varied sentence structures.`;
    linguisticNoteSi = `සම්බන්ධක පද හොඳින් භාවිතා කර ඇත (${connectorCount} ක් සොයාගත්). විවිධ වාක්‍ය ව්‍යුහ.`;
  } else if (linguisticScore === 1) {
    linguisticNote =
      "Some connectors used. Try adding more discourse markers like 'however', 'moreover', 'in conclusion'.";
    linguisticNoteSi =
      "සම්බන්ධක පද කිහිපයක් භාවිතා කර ඇත. 'however', 'moreover', 'in conclusion' වැනි තවත් සම්බන්ධක පද එකතු කරන්න.";
  } else {
    linguisticNote =
      "Use discourse markers to connect ideas: 'however', 'furthermore', 'in conclusion', 'for example'.";
    linguisticNoteSi =
      "අදහස් සම්බන්ධ කිරීමට සම්බන්ධක පද භාවිතා කරන්න: 'however', 'furthermore', 'in conclusion', 'for example'.";
  }

  // ── Aggregate ─────────────────────────────────────────────────
  const dimensions: WeScoreDimension[] = [
    {
      label: "Content",
      labelSi: "අන්තර්ගතය",
      score: contentScore,
      maxScore: 3,
      note: contentNote,
      noteSi: contentNoteSi,
    },
    {
      label: "Form",
      labelSi: "ආකෘතිය",
      score: formScore,
      maxScore: 2,
      note: formNote,
      noteSi: formNoteSi,
    },
    {
      label: "Development",
      labelSi: "සංවර්ධනය",
      score: structureScore,
      maxScore: 2,
      note: structureNote,
      noteSi: structureNoteSi,
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
    {
      label: "Spelling",
      labelSi: "අක්ෂර වින්‍යාසය",
      score: spellingScore,
      maxScore: 2,
      note: spellingNote,
      noteSi: spellingNoteSi,
    },
    {
      label: "Linguistic Range",
      labelSi: "භාෂා පරාසය",
      score: linguisticScore,
      maxScore: 2,
      note: linguisticNote,
      noteSi: linguisticNoteSi,
    },
  ];

  const finalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  const maxScore = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
  const percentage =
    maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0;

  return {
    wordCount,
    isWithinRange,
    dimensions,
    finalScore,
    maxScore,
    percentage,
  };
}
