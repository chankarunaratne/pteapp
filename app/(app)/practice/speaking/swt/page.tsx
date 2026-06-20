"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import SwtScoreOverview from "@/components/swt/SwtScoreOverview";
import SwtFeedbackPanel from "@/components/swt/SwtFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { SWT_QUESTIONS } from "@/lib/questions";
import { scoreSwtAnswer, type SwtScoreResult } from "@/lib/swtScoring";

type Phase = "question" | "result" | "summary";

const TOTAL_SECONDS = 10 * 60; // 10 minutes
const WORD_LIMIT = 75;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SwtSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<SwtScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = SWT_QUESTIONS[index];
  const currentScore = scores[index];
  const wordCount = countWords(answer);

  // ── Timer logic ────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(TOTAL_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // Start timer on mount and when question changes
  useEffect(() => {
    if (phase === "question") {
      startTimer();
    }
    return () => stopTimer();
  }, [index, phase, startTimer, stopTimer]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && phase === "question") {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  // Cleanup feedback timer
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // ── Clipboard toolbar ──────────────────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
    if (selected) navigator.clipboard.writeText(selected);
  };

  const handleCut = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    if (selected) {
      navigator.clipboard.writeText(selected);
      const newVal = ta.value.substring(0, start) + ta.value.substring(end);
      setAnswer(newVal);
      // Restore cursor position after state update
      requestAnimationFrame(() => {
        ta.selectionStart = start;
        ta.selectionEnd = start;
        ta.focus();
      });
    }
  };

  const handlePaste = async () => {
    const ta = textareaRef.current;
    if (!ta) return;
    try {
      const text = await navigator.clipboard.readText();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal =
        ta.value.substring(0, start) + text + ta.value.substring(end);
      setAnswer(newVal);
      const newCursor = start + text.length;
      requestAnimationFrame(() => {
        ta.selectionStart = newCursor;
        ta.selectionEnd = newCursor;
        ta.focus();
      });
    } catch {
      // Clipboard read might be denied
    }
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleSubmit = () => {
    stopTimer();
    setScores((prev) => [...prev, scoreSwtAnswer(question, answer)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScores((prev) => prev.slice(0, index));
    setAnswer("");
    setPhase("question");
  };

  const handleNext = () => {
    if (index + 1 >= SWT_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setAnswer("");
      setPhase("question");
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setAnswer("");
    setPhase("question");
  };

  // ── Summary screen ────────────────────────────────────────
  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  // Timer color
  const timerColor =
    timeLeft <= 60
      ? "text-red-600"
      : timeLeft <= 180
        ? "text-amber-600"
        : "text-gray-700";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">
          Practice
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">
          Speaking &amp; Writing
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">
          Summarize Written Text
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {SWT_QUESTIONS.length}
        </h1>
        {/* Timer */}
        {phase === "question" && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold tabular-nums ${
              timeLeft <= 60
                ? "border-red-200 bg-red-50"
                : timeLeft <= 180
                  ? "border-amber-200 bg-amber-50"
                  : "border-gray-200 bg-white"
            } ${timerColor}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / SWT_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Instruction */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-700 flex items-start gap-1">
          <span className="italic">
            Read the passage below and summarize it using one sentence. Type
            your response in the box at the bottom of the screen. You have 10
            minutes to finish this task. Your response will be judged on the
            quality of your writing and on how well your response presents the
            key points in the passage.
          </span>
          <InfoPopover align="right">
            පහත ඡේදය කියවා එය එක් වාක්‍යයකින් සාරාංශ කරන්න. ඔබේ පිළිතුර
            වචන 75 කට වඩා අඩු විය යුතුය. ලිවීමේ ගුණාත්මකභාවය සහ ප්‍රධාන
            කරුණු ඇතුළත් කිරීම මත ලකුණු ලැබේ.
          </InfoPopover>
        </p>

        {/* Passage */}
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          {question.passage.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm text-gray-800 leading-relaxed [&:not(:first-child)]:mt-4"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Answer area */}
        {phase === "question" && (
          <>
            {/* Clipboard toolbar + word count */}
            <div className="mt-5 flex items-center justify-between rounded-t-xl border border-b-0 border-gray-300 bg-gray-50 px-4 py-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleCut}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                >
                  Cut
                </button>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                >
                  Paste
                </button>
              </div>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  wordCount > WORD_LIMIT ? "text-red-600" : "text-gray-500"
                }`}
              >
                {wordCount} / {WORD_LIMIT} Word Limit
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              autoFocus
              spellCheck={false}
              placeholder="Type your one-sentence summary here..."
              className="w-full resize-none rounded-b-xl border border-gray-300 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answer.trim().length === 0}
                className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {/* Show user's answer in result phase */}
        {phase === "result" && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-900">
              Your summary
            </h3>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              {answer || <span className="italic text-gray-400">No answer submitted</span>}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span>
                {countWords(answer)} word{countWords(answer) !== 1 ? "s" : ""}
              </span>
              {countWords(answer) > WORD_LIMIT && (
                <span className="font-semibold text-red-600">
                  Over {WORD_LIMIT}-word limit
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback card */}
      {phase === "result" && currentScore && (
        <>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {feedbackLoading ? (
              <div className="flex flex-col items-center justify-center py-12 animate-feedback-loader-in">
                <div
                  className="h-8 w-8 rounded-full border-[3px] border-gray-200 border-t-primary-500"
                  style={{
                    animation: "feedback-spin 0.75s linear infinite",
                  }}
                />
                <p className="mt-3 text-sm font-medium text-gray-400">
                  Analyzing your summary…
                </p>
              </div>
            ) : (
              <div className="animate-feedback-reveal p-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Teacher feedback
                </h2>

                <div className="mt-4">
                  <SwtScoreOverview score={currentScore} lang={lang} />
                </div>

                <SwtFeedbackPanel
                  score={currentScore}
                  sampleAnswer={question.sampleAnswer}
                  explanationEn={question.explanationEn}
                  explanationSi={question.explanationSi}
                  lang={lang}
                />
              </div>
            )}
          </div>

          {!feedbackLoading && (
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {index + 1 >= SWT_QUESTIONS.length
                  ? "See Summary"
                  : "Next Question"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Session Summary                                                    */
/* ------------------------------------------------------------------ */

function SessionSummary({
  scores,
  onTryAgain,
}: {
  scores: SwtScoreResult[];
  onTryAgain: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalScore = scores.reduce((sum, s) => sum + s.finalScore, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const accuracy =
    totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  // Find weak dimensions
  const weakDimensions = [
    ...new Set(
      scores.flatMap((s) =>
        s.dimensions
          .filter((d) => d.score < d.maxScore)
          .map((d) => d.label)
      )
    ),
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-feedback-loader-in">
        <div
          className="h-8 w-8 rounded-full border-[3px] border-gray-200 border-t-primary-500"
          style={{ animation: "feedback-spin 0.75s linear infinite" }}
        />
        <p className="mt-3 text-sm font-medium text-gray-400">
          Generating summary report…
        </p>
      </div>
    );
  }

  return (
    <div className="animate-feedback-reveal">
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">
          Practice
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">
          Speaking &amp; Writing
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">
          Summarize Written Text
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Session complete
      </h1>
      <p className="sinhala mt-1 text-sm text-gray-500">
        සැසිය අවසන්! ඔබේ ප්‍රතිඵල පහළින් බලන්න.
      </p>

      {/* Summary Score Dashboard */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">
            {totalScore}/{totalMax}
          </p>
          <p className="mt-1 text-sm text-gray-500">Total Points</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p
            className={`text-3xl font-bold ${
              accuracy >= 70 ? "text-green-600" : "text-amber-600"
            }`}
          >
            {accuracy}%
          </p>
          <p className="mt-1 text-sm text-gray-500">Accuracy</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{scores.length}</p>
          <p className="mt-1 text-sm text-gray-500">Questions done</p>
        </div>
      </div>

      {/* Areas to improve */}
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          Areas to improve
        </h2>
        <p className="sinhala mt-0.5 text-xs text-gray-500">
          මෙම ක්ෂේත්‍රවල වැඩිදියුණු කිරීමට අවධානය යොමු කරන්න.
        </p>
        {weakDimensions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {weakDimensions.map((dim) => (
              <span
                key={dim}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800"
              >
                {dim}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-green-700 font-medium">
            No weak areas — perfect session!
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Try Again
        </button>
        <Link
          href="/practice"
          className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Practice
        </Link>
      </div>
    </div>
  );
}
