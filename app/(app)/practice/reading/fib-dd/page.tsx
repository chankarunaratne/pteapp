"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import FibDdScoreOverview from "@/components/fib-dd/FibDdScoreOverview";
import FibDdFeedbackPanel from "@/components/fib-dd/FibDdFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { FIB_DD_QUESTIONS } from "@/lib/questions";
import { scoreFibDdAnswer, parseExpectedAnswers, type FibDdScoreResult } from "@/lib/fibDdScoring";

type Phase = "question" | "result" | "summary";

export default function FibDdSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<FibDdScoreResult[]>([]);
  const { lang } = useLanguage();

  const question = FIB_DD_QUESTIONS[index];
  const currentScore = scores[index];

  // Placed words map: blankIndex -> word string
  const [placedWords, setPlacedWords] = useState<Record<number, string>>({});
  
  // Shuffled options list (shuffled once on question load)
  const [optionsPool, setOptionsPool] = useState<string[]>([]);
  
  // Click-to-place selected word from the pool
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Drag and drop state refs
  const draggedWordRef = useRef<string | null>(null);
  const draggedSourceRef = useRef<"pool" | { blankIdx: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize question and shuffle options
  useEffect(() => {
    const correctAnswers = parseExpectedAnswers(question.passage);
    const combined = [...correctAnswers, ...question.distractors];
    // Dynamic random shuffle
    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    setOptionsPool(shuffled);
    setPlacedWords({});
    setSelectedWord(null);
  }, [index, question]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Derived available pool words (filtered out currently placed words)
  const availableWords = optionsPool.filter(
    (word) => !Object.values(placedWords).includes(word)
  );

  // Click-to-place interaction
  const handleSelectWordFromPool = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "question") return;
    
    if (selectedWord === word) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
    }
  };

  const handleBlankClick = (blankIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "question") return;

    const currentPlaced = placedWords[blankIdx];

    if (selectedWord) {
      // Place the selected word
      const next = { ...placedWords };
      next[blankIdx] = selectedWord;
      setPlacedWords(next);
      setSelectedWord(null);
    } else if (currentPlaced) {
      // Clicked occupied blank without selected word -> double click shortcut removes it,
      // but let's also remove it on single click to make click-based management smooth!
      const next = { ...placedWords };
      delete next[blankIdx];
      setPlacedWords(next);
    }
  };

  const handleDoubleClickPlaced = (blankIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "question") return;
    const next = { ...placedWords };
    delete next[blankIdx];
    setPlacedWords(next);
  };

  const handleContainerClick = () => {
    if (phase !== "question") return;
    setSelectedWord(null);
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    word: string,
    source: "pool" | { blankIdx: number }
  ) => {
    if (phase !== "question") {
      e.preventDefault();
      return;
    }
    draggedWordRef.current = word;
    draggedSourceRef.current = source;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    draggedWordRef.current = null;
    draggedSourceRef.current = null;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBlank = (e: React.DragEvent, targetBlankIdx: number) => {
    e.preventDefault();
    e.stopPropagation();

    const srcWord = draggedWordRef.current;
    const srcSource = draggedSourceRef.current;

    if (!srcWord || !srcSource) return;

    const next = { ...placedWords };

    if (srcSource === "pool") {
      // Move from pool to blank
      next[targetBlankIdx] = srcWord;
    } else {
      // Move from one blank to another blank
      const sourceBlankIdx = srcSource.blankIdx;
      if (sourceBlankIdx !== targetBlankIdx) {
        const targetPrevWord = next[targetBlankIdx];
        next[targetBlankIdx] = srcWord;
        if (targetPrevWord) {
          next[sourceBlankIdx] = targetPrevWord; // Swap
        } else {
          delete next[sourceBlankIdx]; // Move
        }
      }
    }

    setPlacedWords(next);
    setSelectedWord(null);
    handleDragEnd();
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    const srcWord = draggedWordRef.current;
    const srcSource = draggedSourceRef.current;

    if (!srcWord || !srcSource || srcSource === "pool") return;

    // Dragged from a blank back to the pool container
    const next = { ...placedWords };
    delete next[srcSource.blankIdx];
    setPlacedWords(next);
    setSelectedWord(null);
    handleDragEnd();
  };

  // Submit and page navigation
  const handleSubmit = () => {
    setScores((prev) => [...prev, scoreFibDdAnswer(question, placedWords)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScores((prev) => prev.slice(0, index));
    setPlacedWords({});
    setSelectedWord(null);
    setPhase("question");
  };

  const handleNext = () => {
    if (index + 1 >= FIB_DD_QUESTIONS.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setPhase("question");
    }
  };

  const handleTryAgain = () => {
    setScores([]);
    setIndex(0);
    setPhase("question");
  };

  if (phase === "summary") {
    return <SessionSummary scores={scores} onTryAgain={handleTryAgain} />;
  }

  // Parse passage into text segments and blanks
  const parts = question.passage.split(/\{\{[^}]+\}\}/g);
  const correctAnswers = parseExpectedAnswers(question.passage);

  return (
    <div onClick={handleContainerClick} className="min-h-[500px]">
      {/* Breadcrumbs */}
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Reading</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Fill in the Blanks (Drag &amp; Drop)</span>
      </div>

      {/* Header */}
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {FIB_DD_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / FIB_DD_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-5 rounded-2xl bg-gray-50/50 border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            i
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              In the text below some words are missing. Drag words from the box below to the appropriate place in the text.
              <span className="ml-2.5 inline-block align-middle">
                <InfoPopover>
                  පහත දැක්වෙන පෙළෙහි සමහර වචන මඟ හැරී ඇත. ඒවා පිරවීම සඳහා පහළ ඇති කොටුවෙන් වචන ඇදගෙනවිත් අදාළ ස්ථානයට දමන්න (drag and drop). තේරීමක් අවලංගු කිරීමට, එම වචනය නැවත පහළ කොටුවට ඇදගෙන යන්න.
                </InfoPopover>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Question Card Containing Passage with Gaps */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm select-none">
        <p className="text-gray-800 leading-loose text-base font-normal">
          {parts.map((part, i) => {
            const hasBlank = i < correctAnswers.length;
            const placedWord = placedWords[i];

            return (
              <span key={i}>
                <span>{part}</span>
                {hasBlank && (
                  <span
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnBlank(e, i)}
                    onClick={(e) => handleBlankClick(i, e)}
                    onDoubleClick={(e) => handleDoubleClickPlaced(i, e)}
                    className={`inline-flex items-center justify-center mx-1.5 align-middle transition-all ${
                      placedWord
                        ? "border border-primary-200 bg-primary-50/40 text-primary-700 font-semibold px-3.5 py-0.5 rounded text-sm cursor-grab active:cursor-grabbing hover:bg-primary-50/60"
                        : "border-2 border-dashed border-gray-300 bg-gray-50/30 rounded h-7 w-28 text-xs text-gray-400 font-semibold"
                    }`}
                    draggable={phase === "question" && !!placedWord}
                    onDragStart={(e) => placedWord && handleDragStart(e, placedWord, { blankIdx: i })}
                    onDragEnd={handleDragEnd}
                    title={placedWord ? "Double-click to remove" : "Click or drag a word here"}
                  >
                    {placedWord || ""}
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>

      {/* Word Options Pool Container */}
      {phase === "question" && (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDropOnPool}
          className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 min-h-[90px] select-none"
        >
          {availableWords.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-3">All words placed</p>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word) => {
                const isSelected = selectedWord === word;
                return (
                  <div
                    key={word}
                    draggable={phase === "question"}
                    onDragStart={(e) => handleDragStart(e, word, "pool")}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => handleSelectWordFromPool(word, e)}
                    className={`group flex items-center gap-1.5 rounded-lg border bg-white px-3.5 py-1.5 shadow-sm text-sm font-semibold text-gray-700 transition-all cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-md ${
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-500/20"
                        : "border-gray-200"
                    }`}
                  >
                    <span className="shrink-0 text-gray-300 group-hover:text-primary-400 font-mono text-xs select-none">
                      ::
                    </span>
                    <span>{word}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-end border-t border-gray-200 pt-6 gap-3">
        {phase === "question" ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 cursor-pointer"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 cursor-pointer"
          >
            {index + 1 >= FIB_DD_QUESTIONS.length ? "Finish Session" : "Next Question"}
          </button>
        )}

        {phase === "result" && (
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Teacher feedback panel */}
      {phase === "result" && (
        <>
          {feedbackLoading ? (
            <div className="mt-8 flex flex-col items-center justify-center py-12 animate-feedback-loader-in">
              <div
                className="h-7 w-7 rounded-full border-[3px] border-gray-200 border-t-primary-500"
                style={{ animation: "feedback-spin 0.75s linear infinite" }}
              />
              <p className="mt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Evaluating answers…
              </p>
            </div>
          ) : (
            <div className="animate-feedback-reveal">
              {/* Score Overview */}
              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <FibDdScoreOverview score={currentScore} lang={lang} />
              </div>

              {/* Feedback panel */}
              <FibDdFeedbackPanel
                score={currentScore}
                passage={question.passage}
                explanationEn={question.explanationEn}
                explanationSi={question.explanationSi}
                lang={lang}
              />
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
  scores: FibDdScoreResult[];
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

  const totalCorrect = scores.reduce((sum, s) => sum + s.correctCount, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.totalBlanks, 0);
  const accuracy = totalMax > 0 ? Math.round((totalCorrect / totalMax) * 100) : 0;

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
        <span className="text-gray-600 font-medium">Fill in the Blanks (Drag &amp; Drop)</span>
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

      {/* Tips / Summary text */}
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          {lang === "si" ? "පරිචය විශ්ලේෂණය" : "Practice Analysis"}
        </h2>
        <p className="sinhala mt-1 text-sm text-gray-600 leading-relaxed">
          {lang === "si"
            ? accuracy === 100
              ? "විශිෂ්ටයි! සියලුම පිළිතුරු නිවැරදියි. මේ ආකාරයෙන්ම ඉදිරියට යන්න."
              : accuracy >= 70
              ? "බොහොම හොඳයි! හිස්තැන් පිරවීම පිළිබඳව ඔබට හොඳ අවබෝධයක් ඇත. වැරදුණු තැන් නැවත විවරණය කරන්න."
              : "තවදුරටත් පුහුණුවීම අවශ්‍යයි. වාක්‍ය සන්දර්භය (context) සහ collocations කෙරෙහි වැඩි සැලකිල්ලක් දක්වන්න."
            : accuracy === 100
            ? "Excellent! Perfect answers. Keep up the great work."
            : accuracy >= 70
            ? "Very good job! You have a solid grasp of text contexts. Review details to reach 100%."
            : "More practice needed. Pay closer attention to collocations and vocabulary contexts."}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 cursor-pointer"
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
