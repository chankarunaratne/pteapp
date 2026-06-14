"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import AudioPlayer from "@/components/wfd/AudioPlayer";
import FibPassage from "@/components/lfib/FibPassage";
import FibScoreOverview from "@/components/lfib/FibScoreOverview";
import FibFeedbackPanel from "@/components/lfib/FibFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import type { FeedbackLang } from "@/lib/feedback";
import { FIB_QUESTIONS } from "@/lib/questions";
import { COUNTDOWN_SECONDS } from "@/lib/useTts";
import {
  scoreFibAnswer,
  extractBlanks,
  type FibScoreResult,
} from "@/lib/fibScoring";

type Phase = "question" | "result" | "summary";

export default function FibSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState<FibScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = FIB_QUESTIONS[index];
  const currentScore = scores[index];
  const blankCount = extractBlanks(question.passage).length;

  // Initialize answers array when question changes.
  useEffect(() => {
    setAnswers(new Array(blankCount).fill(""));
  }, [blankCount, index]);

  const handleBlankChange = (blankIndex: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[blankIndex] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => [...prev, scoreFibAnswer(question, answers)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => prev.slice(0, index));
    setAnswers(new Array(blankCount).fill(""));
    setPhase("question");
    setRestartCount((c) => c + 1);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (index + 1 >= FIB_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setAnswers([]);
      setPhase("question");
      setRestartCount(0);
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setAnswers(new Array(blankCount).fill(""));
    setPhase("question");
    setRestartCount(0);
  };

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  const hasAtLeastOneAnswer = answers.some((a) => a.trim().length > 0);

  return (
    <div>
      <div className="text-sm font-normal text-slate-400 flex items-center">
        <Link href="/practice" className="hover:text-slate-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-slate-600 transition">Listening</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-600 font-medium">Fill in the blanks</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {FIB_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / FIB_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card — instructions + audio + passage */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-slate-700">
          You will hear a recording. Type the missing words in each blank.{" "}
          <InfoPopover align="right">
            Recording එක ඇහුවහම, පෙළෙහි හිස්තැන් වලට ගැලපෙන වචන ටයිප් කරන්න.
            ඇහෙන විදිහටම ලියන්න — අකුරු වැරදුණොත් ලකුණු අඩු වෙනවා.
          </InfoPopover>
        </p>

        <div className="mt-5">
          <AudioPlayer
            key={`${question.id}-${restartCount}`}
            sentence={question.fullText}
            paused={phase !== "question"}
            onRestart={phase === "result" ? handleRestart : undefined}
            lang={lang}
          />
        </div>

        {/* Passage with inline blanks */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
          <FibPassage
            passage={question.passage}
            answers={answers}
            onChange={handleBlankChange}
            results={phase === "result" ? currentScore?.blanks : undefined}
            disabled={phase !== "question"}
          />
        </div>

        {phase === "question" && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasAtLeastOneAnswer}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Feedback card — shown after submission */}
      {phase === "result" && currentScore && (
        <>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {feedbackLoading ? (
              <div className="flex flex-col items-center justify-center py-12 animate-feedback-loader-in">
                <div
                  className="h-8 w-8 rounded-full border-[3px] border-slate-200 border-t-brand-500"
                  style={{ animation: "feedback-spin 0.75s linear infinite" }}
                />
                <p className="mt-3 text-sm font-medium text-slate-400">
                  Analyzing your answers…
                </p>
              </div>
            ) : (
              <div className="animate-feedback-reveal p-6">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Teacher feedback
                </h2>

                <div className="mt-4">
                  <FibScoreOverview score={currentScore} lang={lang} />
                </div>

                <FibFeedbackPanel score={currentScore} lang={lang} />
              </div>
            )}
          </div>

          {!feedbackLoading && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {index + 1 >= FIB_QUESTIONS.length
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
  scores: FibScoreResult[];
  onTryAgain: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalCorrect = scores.reduce((sum, s) => sum + s.correctCount, 0);
  const totalBlanks = scores.reduce((sum, s) => sum + s.totalBlanks, 0);
  const accuracy =
    totalBlanks > 0 ? Math.round((totalCorrect / totalBlanks) * 100) : 0;
  const missedWords = [
    ...new Set(
      scores.flatMap((s) =>
        s.blanks.filter((b) => !b.correct).map((b) => b.expected)
      )
    ),
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-feedback-loader-in">
        <div
          className="h-8 w-8 rounded-full border-[3px] border-slate-200 border-t-brand-500"
          style={{ animation: "feedback-spin 0.75s linear infinite" }}
        />
        <p className="mt-3 text-sm font-medium text-slate-400">
          Generating summary report…
        </p>
      </div>
    );
  }

  return (
    <div className="animate-feedback-reveal">
      <div className="text-sm font-normal text-slate-400 flex items-center">
        <Link href="/practice" className="hover:text-slate-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-slate-600 transition">Listening</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-600 font-medium">Fill in the blanks</span>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Session complete
      </h1>
      <p className="sinhala mt-1 text-sm text-slate-500">
        සැසිය අවසන්! ඔබේ ප්‍රතිඵල පහළින් බලන්න.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-900">
            {totalCorrect}/{totalBlanks}
          </p>
          <p className="mt-1 text-sm text-slate-500">Blanks correct</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p
            className={`text-3xl font-bold ${
              accuracy >= 70 ? "text-green-600" : "text-amber-600"
            }`}
          >
            {accuracy}%
          </p>
          <p className="mt-1 text-sm text-slate-500">Accuracy</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-900">{scores.length}</p>
          <p className="mt-1 text-sm text-slate-500">Questions done</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Words to review
        </h2>
        <p className="sinhala mt-0.5 text-xs text-slate-500">
          මේ වචන ආයෙත් පුහුණු කරන්න — ඊළඟ වතාවේ වැරදෙන්නේ නැති වෙන්න.
        </p>
        {missedWords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {missedWords.map((word) => (
              <span
                key={word}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-800"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-green-700">
            No missed words — perfect session!
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Try Again
        </button>
        <Link
          href="/practice"
          className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Practice
        </Link>
      </div>
    </div>
  );
}
