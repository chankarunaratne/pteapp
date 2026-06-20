"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import AudioPlayer from "@/components/wfd/AudioPlayer";
import HiwTranscript from "@/components/hiw/HiwTranscript";
import HiwScoreOverview from "@/components/hiw/HiwScoreOverview";
import HiwFeedbackPanel from "@/components/hiw/HiwFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { HIW_QUESTIONS } from "@/lib/questions";
import { scoreHiwAnswer, type HiwScoreResult } from "@/lib/hiwScoring";

type Phase = "question" | "result" | "summary";

export default function HiwSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [scores, setScores] = useState<HiwScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = HIW_QUESTIONS[index];
  const currentScore = scores[index];

  const handleSelectedChange = (indices: number[]) => {
    setSelectedIndices(indices);
  };

  const handleSubmit = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => [...prev, scoreHiwAnswer(question, selectedIndices)]);
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
    setRestartCount((c) => c + 1);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (index + 1 >= HIW_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setSelectedIndices([]);
      setPhase("question");
      setRestartCount(0);
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setSelectedIndices([]);
    setPhase("question");
    setRestartCount(0);
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
        <Link href="/practice" className="hover:text-gray-600 transition">Listening</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Highlight incorrect words</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {HIW_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / HIW_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card — instructions + audio + transcript */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-base font-medium text-gray-700 flex items-start gap-1">
          <span>
            You will hear a recording. Below is a transcript of the audio. Some words in the transcript do not match what the speaker said. Click on the words that are different.
          </span>
          <InfoPopover align="right">
            ඔබට පටිගත කිරීමක් ඇසෙනු ඇත. පහත දැක්වෙන්නේ එහි පිටපතකි. මෙහි ඇති සමහර වචන කථා කරන්නා පැවසූ වචන සමඟ නොගැලපේ. වෙනස් වන වචන මත ක්ලික් කර ඒවා තෝරන්න.
          </InfoPopover>
        </div>

        <div className="mt-5">
          <AudioPlayer
            key={`${question.id}-${restartCount}`}
            sentence={question.fullText}
            paused={phase !== "question"}
            onRestart={phase === "result" ? handleRestart : undefined}
            lang={lang}
          />
        </div>

        {/* Transcript block */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <HiwTranscript
            transcript={question.transcript}
            selectedIndices={selectedIndices}
            onChange={handleSelectedChange}
            feedbacks={phase === "result" ? currentScore?.wordFeedbacks : undefined}
            disabled={phase !== "question"}
          />
        </div>

        {phase === "question" && (
          <div className="mt-4 flex justify-end">
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
                  <HiwScoreOverview score={currentScore} lang={lang} />
                </div>

                <HiwFeedbackPanel score={currentScore} lang={lang} />
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
                {index + 1 >= HIW_QUESTIONS.length
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
  scores: HiwScoreResult[];
  onTryAgain: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalCorrect = scores.reduce((sum, s) => sum + s.finalScore, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const accuracy = totalMax > 0 ? Math.round((totalCorrect / totalMax) * 100) : 0;

  const missedWords = [
    ...new Set(
      scores.flatMap((s) =>
        s.wordFeedbacks
          .filter((w) => w.status === "missed")
          .map((w) => `“${w.word}” (should be “${w.correctWord}”)`)
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
        <Link href="/practice" className="hover:text-gray-600 transition">Listening</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Highlight incorrect words</span>
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

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          Words to review
        </h2>
        <p className="sinhala mt-0.5 text-xs text-gray-500">
          මඟ හැරුණු වැරදි වචන නැවත පුහුණු වන්න.
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
