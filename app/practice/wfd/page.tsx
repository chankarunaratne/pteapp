"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import AudioPlayer from "@/components/wfd/AudioPlayer";
import FeedbackPanel from "@/components/wfd/FeedbackPanel";
import WordDiff from "@/components/wfd/WordDiff";
import type { FeedbackLang } from "@/lib/feedback";
import { WFD_QUESTIONS } from "@/lib/questions";
import { COUNTDOWN_SECONDS } from "@/lib/useTts";
import { scoreAnswer, type ScoreResult } from "@/lib/scoring";

const LANG_STORAGE_KEY = "ptelanka-feedback-lang";

type Phase = "question" | "result" | "summary";

export default function WfdSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<ScoreResult[]>([]);
  const [lang, setLang] = useState<FeedbackLang>("si");

  useEffect(() => {
    const stored = sessionStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "si" || stored === "en") setLang(stored);
  }, []);

  const handleLangChange = useCallback((next: FeedbackLang) => {
    setLang(next);
    sessionStorage.setItem(LANG_STORAGE_KEY, next);
  }, []);

  const question = WFD_QUESTIONS[index];
  const currentScore = scores[index];

  const handleSubmit = () => {
    window.speechSynthesis?.cancel();
    setScores((prev) => [...prev, scoreAnswer(question.sentence, answer)]);
    setPhase("result");
  };

  const handleNext = () => {
    if (index + 1 >= WFD_QUESTIONS.length) {
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

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  return (
    <div>
      <p className="text-center text-sm font-normal text-slate-400">
        Listening · Write From Dictation
      </p>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {WFD_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / WFD_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-slate-700">
          The audio will start playing in {COUNTDOWN_SECONDS} seconds. Type the
          sentence exactly as you hear it.{" "}
          <InfoPopover align="right">
            ඇහෙන විදිහටම ඒ වාක්‍යය පහළ කොටුවේ ලියන්න. අකුරු වැරදුණොත් ලකුණු අඩු
            වෙනවා.
          </InfoPopover>
        </p>

        <div className="mt-5">
          {/* Remount per question so countdown and replay count reset */}
          <AudioPlayer
            key={question.id}
            sentence={question.sentence}
            paused={phase !== "question"}
          />
        </div>

        {phase === "question" ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              autoFocus
              spellCheck={false}
              placeholder="Type what you hear..."
              className="mt-5 w-full resize-none rounded-xl border border-slate-300 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answer.trim().length === 0}
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          currentScore && (
            <div className="mt-5 space-y-5">
              {(() => {
                const pct =
                  currentScore.total > 0
                    ? Math.round(
                        (currentScore.correct / currentScore.total) * 100
                      )
                    : 0;
                const colorClass =
                  pct >= 80
                    ? "text-green-600 bg-green-50 border-green-200"
                    : pct >= 50
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : "text-red-600 bg-red-50 border-red-200";
                return (
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Your result
                    </h2>
                    <span
                      className={`rounded-full border px-4 py-1 text-xl font-bold ${colorClass}`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })()}

              <WordDiff score={currentScore} />

              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  Correct sentence:{" "}
                </span>
                {question.sentence}
              </div>

              <FeedbackPanel
                score={currentScore}
                question={question}
                lang={lang}
                onLangChange={handleLangChange}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {index + 1 >= WFD_QUESTIONS.length
                    ? "See Summary"
                    : "Next Question"}
                </button>
              </div>
            </div>
          )
        )}
      </div>
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

  return (
    <div>
      <p className="text-center text-sm font-normal text-slate-400">
        Listening · Write From Dictation
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Session complete
      </h1>
      <p className="sinhala mt-1 text-sm text-slate-500">
        සැසිය අවසන්! ඔබේ ප්‍රතිඵල පහළින් බලන්න.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-900">
            {totalCorrect}/{totalWords}
          </p>
          <p className="mt-1 text-sm text-slate-500">Words correct</p>
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
        {weakWords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {weakWords.map((word) => (
              <span
                key={word}
                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-sm font-medium text-red-700"
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
