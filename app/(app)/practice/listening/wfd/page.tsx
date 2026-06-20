"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import AudioPlayer from "@/components/wfd/AudioPlayer";
import FeedbackPanel from "@/components/wfd/FeedbackPanel";
import ScoreOverview from "@/components/wfd/ScoreOverview";
import WordDiff from "@/components/wfd/WordDiff";
import { useLanguage } from "@/lib/LanguageContext";
import type { FeedbackLang } from "@/lib/feedback";
import { WFD_QUESTIONS } from "@/lib/questions";
import { COUNTDOWN_SECONDS } from "@/lib/useTts";
import { scoreAnswer, type ScoreResult } from "@/lib/scoring";

type Phase = "question" | "result" | "summary";

export default function WfdSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<ScoreResult[]>([]);
  const { lang } = useLanguage();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = WFD_QUESTIONS[index];
  const currentScore = scores[index];

  const handleSubmit = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => [...prev, scoreAnswer(question.sentence, answer)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => prev.slice(0, index));
    setAnswer("");
    setPhase("question");
    setRestartCount((c) => c + 1);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (index + 1 >= WFD_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setAnswer("");
      setPhase("question");
      setRestartCount(0);
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setAnswer("");
    setPhase("question");
    setRestartCount(0);
  };

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  return (
    <div>
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Listening</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Write from dictation</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {WFD_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / WFD_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card — instructions + audio + input */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-700">
          The audio will start playing in {COUNTDOWN_SECONDS} seconds. Type the
          sentence exactly as you hear it.{" "}
          <InfoPopover align="right">
            ඇහෙන විදිහටම ඒ වාක්‍යය පහළ කොටුවේ ලියන්න. අකුරු වැරදුණොත් ලකුණු අඩු
            වෙනවා.
          </InfoPopover>
        </p>

        <div className="mt-5">
          <AudioPlayer
            key={`${question.id}-${restartCount}`}
            sentence={question.sentence}
            paused={phase !== "question"}
            onRestart={phase === "result" ? handleRestart : undefined}
            lang={lang}
          />
        </div>

        {phase === "result" && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">
              You typed
            </h3>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              {answer}
            </p>
          </div>
        )}

        {phase === "question" && (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              autoFocus
              spellCheck={false}
              placeholder="Type what you hear..."
              className="mt-5 w-full resize-none rounded-xl border border-gray-300 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
                  Analyzing your answer…
                </p>
              </div>
            ) : (
              <div className="animate-feedback-reveal p-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Teacher feedback
                </h2>

                <div className="mt-4">
                  <ScoreOverview score={currentScore} lang={lang} />
                </div>

                {/* Sentence comparison */}
                <div className="mt-6 border-t border-gray-200 pt-6 -mx-6 px-6">
                  <h3 className={`text-sm font-semibold text-gray-900 ${lang === "si" ? "sinhala" : ""}`}>
                    {lang === "si" ? "වාක්‍ය විශ්ලේෂණය" : "Sentence comparison"}
                  </h3>
                  <div className="mt-3">
                    <WordDiff score={currentScore} lang={lang} />
                  </div>
                </div>

                {/* Detailed explanation */}
                <FeedbackPanel
                  score={currentScore}
                  question={question}
                  lang={lang}
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
                {index + 1 >= WFD_QUESTIONS.length
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

function SessionSummary({
  scores,
  onTryAgain,
}: {
  scores: ScoreResult[];
  onTryAgain: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalCorrect = scores.reduce((sum, s) => sum + s.correct, 0);
  const totalWords = scores.reduce((sum, s) => sum + s.total, 0);
  const accuracy =
    totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;
  const weakWords = [
    ...new Set(
      scores.flatMap((s) =>
        s.words
          .filter((w) => w.status === "missing" || w.status === "misspelled")
          .map((w) => w.word)
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
        <span className="text-gray-600 font-medium">Write from dictation</span>
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
            {totalCorrect}/{totalWords}
          </p>
          <p className="mt-1 text-sm text-gray-500">Words correct</p>
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
        {weakWords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {weakWords.map((word) => (
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
            No weak words — perfect session!
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
