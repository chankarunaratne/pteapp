"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import RfibPassage from "@/components/rfib/RfibPassage";
import RfibScoreOverview from "@/components/rfib/RfibScoreOverview";
import RfibFeedbackPanel from "@/components/rfib/RfibFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { RFIB_QUESTIONS } from "@/lib/questions";
import {
  scoreRfibAnswer,
  type RfibScoreResult,
} from "@/lib/rfibScoring";

type Phase = "question" | "result" | "summary";

export default function RfibSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [scores, setScores] = useState<RfibScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = RFIB_QUESTIONS[index];
  const currentScore = scores[index];
  const blankCount = question.blanks.length;

  // Initialize selections when question changes.
  useEffect(() => {
    setSelections(new Array(blankCount).fill(""));
  }, [blankCount, index]);

  const handleSelectionChange = (blankIndex: number, value: string) => {
    setSelections((prev) => {
      const next = [...prev];
      next[blankIndex] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    setScores((prev) => [...prev, scoreRfibAnswer(question, selections)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScores((prev) => prev.slice(0, index));
    setSelections(new Array(blankCount).fill(""));
    setPhase("question");
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (index + 1 >= RFIB_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setSelections([]);
      setPhase("question");
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setSelections(new Array(blankCount).fill(""));
    setPhase("question");
  };

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  const hasAtLeastOneSelection = selections.some((s) => s.length > 0);

  return (
    <div>
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Reading</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Fill in the blanks (Dropdown)</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {RFIB_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / RFIB_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card — instructions + passage with dropdown blanks */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-700">
          You will see some text with several gaps. Choose the correct words from the drop-down menu to fill in the gaps.{" "}
          <InfoPopover align="right">
            පෙළෙහි හිස්තැන් අසල ඇති dropdown එක ක්ලික් කර, අර්ථය ගැලපෙන නිවැරදි
            වචනය තෝරන්න. සන්දර්භය හොඳින් කියවන්න.
          </InfoPopover>
        </p>

        {/* Passage with inline dropdown blanks */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <RfibPassage
            passage={question.passage}
            blanks={question.blanks}
            selections={selections}
            onChange={handleSelectionChange}
            results={phase === "result" ? currentScore?.blanks : undefined}
            disabled={phase !== "question"}
          />
        </div>

        {phase === "question" && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {selections.filter((s) => s.length > 0).length} of {blankCount} blanks filled
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasAtLeastOneSelection}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Submit
            </button>
          </div>
        )}

        {phase === "result" && !feedbackLoading && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Feedback card — shown after submission */}
      {phase === "result" && currentScore && (
        <>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {feedbackLoading ? (
              <div className="flex flex-col items-center justify-center py-12 animate-feedback-loader-in">
                <div
                  className="h-8 w-8 rounded-full border-[3px] border-gray-200 border-t-primary-500"
                  style={{ animation: "feedback-spin 0.75s linear infinite" }}
                />
                <p className="mt-3 text-sm font-medium text-gray-400">
                  Analyzing your answers…
                </p>
              </div>
            ) : (
              <div className="animate-feedback-reveal p-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Teacher feedback
                </h2>

                <div className="mt-4">
                  <RfibScoreOverview score={currentScore} lang={lang} />
                </div>

                <RfibFeedbackPanel score={currentScore} lang={lang} />
              </div>
            )}
          </div>

          {!feedbackLoading && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {index + 1 >= RFIB_QUESTIONS.length
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
  scores: RfibScoreResult[];
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
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Reading</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Fill in the blanks (Dropdown)</span>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Session complete
      </h1>
      <p className="sinhala mt-1 text-sm text-gray-500">
        සැසිය අවසන්! ඔබේ ප්‍රතිඵල පහළින් බලන්න.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">
            {totalCorrect}/{totalBlanks}
          </p>
          <p className="mt-1 text-sm text-gray-500">Blanks correct</p>
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

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          Words to review
        </h2>
        <p className="sinhala mt-0.5 text-xs text-gray-500">
          මේ වචන ආයෙත් පුහුණු කරන්න — ඊළඟ වතාවේ වැරදෙන්නේ නැති වෙන්න.
        </p>
        {missedWords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {missedWords.map((word) => (
              <span
                key={word}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800"
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
