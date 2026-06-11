export type WordStatus = "correct" | "misspelled" | "missing" | "extra";

export interface WordResult {
  /** Normalised target word (empty for "extra" entries). */
  word: string;
  /** What the user actually typed (empty for "missing" entries). */
  typed: string;
  status: WordStatus;
}

export interface ScoreResult {
  words: WordResult[];
  correct: number;
  total: number;
}

/** Lowercase and strip punctuation, keeping word-internal apostrophes/hyphens. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\-\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ""))
    .filter(Boolean);
}

function editDistance(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** A typed word counts as a misspelling attempt if it's close to the target. */
function isCloseMatch(target: string, typed: string): boolean {
  const dist = editDistance(target, typed);
  const maxLen = Math.max(target.length, typed.length);
  return dist > 0 && dist <= Math.max(1, Math.floor(maxLen * 0.4));
}

/**
 * Score the user's answer against the target sentence, PTE WFD style.
 * Words are aligned via LCS; unmatched neighbouring pairs that are close in
 * spelling are reported as "misspelled" rather than missing + extra.
 */
export function scoreAnswer(sentence: string, answer: string): ScoreResult {
  const target = tokenize(sentence);
  const typed = tokenize(answer);

  // LCS table over exact word matches.
  const m = target.length;
  const n = typed.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] =
        target[i] === typed[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  // Walk the table producing an aligned op sequence.
  const ops: WordResult[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (target[i] === typed[j]) {
      ops.push({ word: target[i], typed: typed[j], status: "correct" });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ word: target[i], typed: "", status: "missing" });
      i++;
    } else {
      ops.push({ word: "", typed: typed[j], status: "extra" });
      j++;
    }
  }
  while (i < m) ops.push({ word: target[i++], typed: "", status: "missing" });
  while (j < n) ops.push({ word: "", typed: typed[j++], status: "extra" });

  // Within each contiguous run of mismatches, pair missing target words with
  // extra typed words that are close in spelling and report them as
  // "misspelled" instead of missing + extra.
  const words: WordResult[] = [];
  let k = 0;
  while (k < ops.length) {
    if (ops[k].status === "correct") {
      words.push(ops[k]);
      k++;
      continue;
    }

    let end = k;
    while (end < ops.length && ops[end].status !== "correct") end++;
    const run = ops.slice(k, end);
    const missingRun = run.filter((op) => op.status === "missing");
    const extraRun = run.filter((op) => op.status === "extra");

    const usedExtra = new Set<number>();
    for (const miss of missingRun) {
      const matchIdx = extraRun.findIndex(
        (ex, idx) => !usedExtra.has(idx) && isCloseMatch(miss.word, ex.typed)
      );
      if (matchIdx !== -1) {
        usedExtra.add(matchIdx);
        words.push({
          word: miss.word,
          typed: extraRun[matchIdx].typed,
          status: "misspelled",
        });
      } else {
        words.push(miss);
      }
    }
    extraRun.forEach((ex, idx) => {
      if (!usedExtra.has(idx)) words.push(ex);
    });

    k = end;
  }

  return {
    words,
    correct: words.filter((w) => w.status === "correct").length,
    total: m,
  };
}
