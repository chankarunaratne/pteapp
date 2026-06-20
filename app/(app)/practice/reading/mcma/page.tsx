"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import McmaScoreOverview from "@/components/mcma/McmaScoreOverview";
import McmaFeedbackPanel from "@/components/mcma/McmaFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { RMCMA_QUESTIONS } from "@/lib/questions";
import { scoreMcmaAnswer, type McmaScoreResult } from "@/lib/mcmaScoring";

type Phase = "question" | "result" | "summary";

export default function RmcmaSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [scores, setScores] = useState<McmaScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = RMCMA_QUESTIONS[index];
  const currentScore = scores[index];

  const handleToggleOption = (oIdx: number) => {
    if (phase !== "question") return;
    setSelectedIndices((prev) =>
      prev.includes(oIdx) ? prev.filter((i) => i !== oIdx) : [...prev, oIdx]
    );
  };

  const handleSubmit = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => [...prev, scoreMcmaAnswer(question, selectedIndices)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => prev.slice(0, index));
    setSelectedIndices([]);
    setPhase("question");
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (index + 1 >= RMCMA_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setSelectedIndices([]);
      setPhase("question");
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setSelectedIndices([]);
    setPhase("question");
  };

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  const hasAtLeastOneSelection = selectedIndices.length > 0;

  return (
    <div>
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Reading</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Multiple-choice, Choose Multiple Answers</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {RMCMA_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / RMCMA_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card — Contains Instructions, Passage, Question & Choices */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Instructions with Sinhala translation Popover */}
        <p className="text-base font-medium text-gray-700 flex items-start gap-1">
          <span>
            Read the text and answer the question by selecting all the correct responses. You will need to select more than one response.
          </span>
          <InfoPopover align="right">
            පෙළ කියවා සියලුම නිවැරදි පිළිතුරු තේරීමෙන් ප්‍රශ්නයට පිළිතුරු සපයන්න. ඔබට එකකට වඩා වැඩි පිළිතුරු ප්‍රමාණයක් තෝරා ගැනීමට සිදුවේ.
          </InfoPopover>
        </p>

        {/* Reading Passage in grey box */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5 prose prose-slate max-w-none text-gray-800 leading-relaxed font-normal">
          <p className="whitespace-pre-line text-base">
            {question.passage}
          </p>
        </div>

        {/* Question Text Prompt */}
        <h3 className="mt-6 text-base font-semibold text-gray-800">
          {question.questionText}
        </h3>

        {/* Options List */}
        <div className="mt-4 space-y-3">
          {question.options.map((option, oIdx) => {
            const isSelected = selectedIndices.includes(oIdx);

            if (phase === "question") {
              const optionClasses = isSelected
                ? "bg-yellow-100/70 border-yellow-400 text-gray-800 shadow-sm"
                : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700";

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleToggleOption(oIdx)}
                  className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-100 ${optionClasses}`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-medium leading-relaxed">
                    {option}
                  </span>
                </button>
              );
            } else {
              // Result / Feedback Phase
              const isCorrect = question.correctIndices.includes(oIdx);

              let borderClass = "";
              let bgClass = "";
              let textClass = "";
              let pillElement = null;

              if (isSelected && isCorrect) {
                borderClass = "border-green-400";
                bgClass = "bg-green-50/60";
                textClass = "text-green-900";
                pillElement = (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 shrink-0">
                    +1 {lang === "si" ? "ලකුණයි" : "point"}
                  </span>
                );
              } else if (isSelected && !isCorrect) {
                borderClass = "border-red-400";
                bgClass = "bg-red-50/60";
                textClass = "text-red-900";
                pillElement = (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 shrink-0">
                    -1 {lang === "si" ? "දඬුවම්" : "penalty"}
                  </span>
                );
              } else if (!isSelected && isCorrect) {
                borderClass = "border-amber-400";
                bgClass = "bg-amber-50/60 animate-pulse";
                textClass = "text-amber-900";
                pillElement = (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 shrink-0">
                    {lang === "si" ? "මඟහැරුණා" : "Missed"}
                  </span>
                );
              } else {
                borderClass = "border-gray-200";
                bgClass = "bg-gray-50/50";
                textClass = "text-gray-400";
              }

              return (
                <div
                  key={oIdx}
                  className={`w-full flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition duration-200 ${borderClass} ${bgClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-75"
                      />
                    </div>
                    <span className={`text-sm font-medium leading-relaxed ${textClass}`}>
                      {option}
                    </span>
                  </div>
                  {pillElement}
                </div>
              );
            }
          })}
        </div>

        {phase === "question" && (
          <div className="mt-6 flex justify-end">
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
          <div className="mt-6 flex justify-end">
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
                  <McmaScoreOverview score={currentScore} lang={lang} />
                </div>

                <McmaFeedbackPanel
                  score={currentScore}
                  explanationEn={question.explanationEn}
                  explanationSi={question.explanationSi}
                  lang={lang}
                  taskType="reading"
                />
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
                {index + 1 >= RMCMA_QUESTIONS.length
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
  scores: McmaScoreResult[];
  onTryAgain: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalCorrect = scores.reduce((sum, s) => sum + s.finalScore, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const accuracy = totalMax > 0 ? Math.round((totalCorrect / totalMax) * 100) : 0;

  const missedOptions = [
    ...new Set(
      scores.flatMap((s) =>
        s.optionFeedbacks
          .filter((o) => o.status === "correct-missed")
          .map((o) => o.option)
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
        <span className="text-gray-600 font-medium">Multiple-choice, Choose Multiple Answers</span>
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
            {totalCorrect}/{totalMax}
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

      {/* Options to review */}
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          Options to review
        </h2>
        <p className="sinhala mt-0.5 text-xs text-gray-500">
          මඟ හැරුණු නිවැරදි පිළිතුරු නැවත අධ්‍යයනය කරන්න.
        </p>
        {missedOptions.length > 0 ? (
          <div className="mt-3 flex flex-col gap-2">
            {missedOptions.map((option) => (
              <div
                key={option}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-sm font-medium text-gray-700"
              >
                {option}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-green-700">
            No missed options — perfect session!
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
