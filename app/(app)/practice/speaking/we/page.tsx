"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import WeScoreOverview from "@/components/we/WeScoreOverview";
import WeFeedbackPanel from "@/components/we/WeFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { WE_QUESTIONS } from "@/lib/questions";
import { scoreWeAnswer, type WeScoreResult } from "@/lib/weScoring";

type Phase = "question" | "result" | "summary";

const TOTAL_SECONDS = 20 * 60; // 20 minutes
const MIN_WORDS = 200;
const MAX_WORDS = 300;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function WeSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<WeScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = WE_QUESTIONS[index];
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
    setScores((prev) => [...prev, scoreWeAnswer(question, answer)]);
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
    if (index + 1 >= WE_QUESTIONS.length) {
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
      : timeLeft <= 300
        ? "text-amber-600"
        : "text-gray-700";

  // Word count color
  const wordCountColor =
    wordCount > MAX_WORDS
      ? "text-red-600"
      : wordCount >= MIN_WORDS
        ? "text-green-600"
        : "text-gray-500";

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
          Write Essay
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {WE_QUESTIONS.length}
        </h1>
        {/* Timer */}
        {phase === "question" && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold tabular-nums ${
              timeLeft <= 60
                ? "border-red-200 bg-red-50"
                : timeLeft <= 300
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
            width: `${((index + (phase === "result" ? 1 : 0)) / WE_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Instruction + Prompt */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-700 flex items-start gap-1">
          <span className="italic">
            You will have 20 minutes to plan, write and revise an essay about
            the topic below. Your response will be judged on how well you
            develop a position, organize your ideas, present supporting details,
            and control the elements of standard written English. You should
            write 200–300 words.
          </span>
          <InfoPopover align="right">
            පහත මාතෘකාව ගැන රචනාවක් සැලසුම් කිරීමට, ලිවීමට සහ සංශෝධනය
            කිරීමට ඔබට මිනිත්තු 20 ක් ඇත. ඔබේ ස්ථාවරය කෙතරම් හොඳින්
            වර්ධනය කරන්නේද, අදහස් සංවිධානය කරන්නේද, සහාය සවිස්තරාත්මකව
            ඉදිරිපත් කරන්නේද, සහ සම්මත ලිඛිත ඉංග්‍රීසි මූලද්‍රව්‍ය
            පාලනය කරන්නේද යන්න මත ඔබේ ප්‍රතිචාරය විනිශ්චය කෙරේ. වචන
            200–300 ක් ලිවිය යුතුය.
          </InfoPopover>
        </p>

        {/* Essay prompt */}
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <p className="text-sm text-gray-800 leading-relaxed">
            {question.prompt}
          </p>
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
                className={`text-xs font-semibold tabular-nums ${wordCountColor}`}
              >
                {wordCount} word{wordCount !== 1 ? "s" : ""}
                {wordCount > 0 && (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (target: {MIN_WORDS}–{MAX_WORDS})
                  </span>
                )}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={14}
              autoFocus
              spellCheck={false}
              placeholder="Type your essay here..."
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
              Your essay
            </h3>
            <div className="mt-1 rounded-lg bg-gray-50 p-3">
              {answer ? (
                answer.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm text-gray-700 leading-relaxed [&:not(:first-child)]:mt-3"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <span className="italic text-gray-400">No answer submitted</span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span>
                {countWords(answer)} word{countWords(answer) !== 1 ? "s" : ""}
              </span>
              {countWords(answer) < MIN_WORDS && (
                <span className="font-semibold text-amber-600">
                  Below {MIN_WORDS}-word minimum
                </span>
              )}
              {countWords(answer) > MAX_WORDS && (
                <span className="font-semibold text-red-600">
                  Over {MAX_WORDS}-word limit
                </span>
              )}
              {countWords(answer) >= MIN_WORDS && countWords(answer) <= MAX_WORDS && (
                <span className="font-semibold text-green-600">
                  ✓ Within target range
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
                  Analyzing your essay…
                </p>
              </div>
            ) : (
              <div className="animate-feedback-reveal p-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Teacher feedback
                </h2>

                <div className="mt-4">
                  <WeScoreOverview score={currentScore} lang={lang} />
                </div>

                <WeFeedbackPanel
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
                {index + 1 >= WE_QUESTIONS.length
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
  scores: WeScoreResult[];
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
          Write Essay
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
