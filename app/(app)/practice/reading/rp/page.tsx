"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfoPopover from "@/components/InfoPopover";
import RpScoreOverview from "@/components/rp/RpScoreOverview";
import RpFeedbackPanel from "@/components/rp/RpFeedbackPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { RP_QUESTIONS } from "@/lib/questions";
import { scoreRpAnswer, type RpScoreResult } from "@/lib/rpScoring";

type Phase = "question" | "result" | "summary";

export default function RpSessionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<RpScoreResult[]>([]);
  const { lang } = useLanguage();
  
  // Selection state
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedListType, setSelectedListType] = useState<"source" | "target" | null>(null);

  // List states (store paragraph indices)
  const [sourceList, setSourceList] = useState<number[]>([]);
  const [targetList, setTargetList] = useState<number[]>([]);

  // Drag and Drop refs
  const draggedIdxRef = useRef<number | null>(null);
  const draggedSourceRef = useRef<"source" | "target" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = RP_QUESTIONS[index];
  const currentScore = scores[index];

  // Initialize and shuffle lists when question index changes
  useEffect(() => {
    const indices = Array.from({ length: question.paragraphs.length }, (_, i) => i);
    // Dynamic random shuffle
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    
    setSourceList(shuffled);
    setTargetList([]);
    setSelectedIdx(null);
    setSelectedListType(null);
  }, [index, question.paragraphs.length]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Selection handlers
  const handleSelect = (idx: number, listType: "source" | "target", e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking card from triggering container deselection
    if (phase !== "question") return;
    
    if (selectedIdx === idx && selectedListType === listType) {
      // Toggle off if clicked again
      setSelectedIdx(null);
      setSelectedListType(null);
    } else {
      setSelectedIdx(idx);
      setSelectedListType(listType);
    }
  };

  const handleContainerClick = () => {
    // Deselect when clicking outside the cards
    if (phase !== "question") return;
    setSelectedIdx(null);
    setSelectedListType(null);
  };

  // Move helpers
  const moveFromSourceToTarget = (idx: number) => {
    if (phase !== "question") return;
    const item = sourceList[idx];
    setSourceList((prev) => prev.filter((_, i) => i !== idx));
    setTargetList((prev) => [...prev, item]);
    setSelectedIdx(null);
    setSelectedListType(null);
  };

  const moveFromTargetToSource = (idx: number) => {
    if (phase !== "question") return;
    const item = targetList[idx];
    setTargetList((prev) => prev.filter((_, i) => i !== idx));
    setSourceList((prev) => [...prev, item]);
    setSelectedIdx(null);
    setSelectedListType(null);
  };

  const handleDoubleClick = (idx: number, listType: "source" | "target") => {
    if (listType === "source") {
      moveFromSourceToTarget(idx);
    } else {
      moveFromTargetToSource(idx);
    }
  };

  // Button actions: moves selected item
  const handleTransferToTarget = () => {
    if (selectedIdx === null || selectedListType !== "source") return;
    moveFromSourceToTarget(selectedIdx);
  };

  const handleTransferToSource = () => {
    if (selectedIdx === null || selectedListType !== "target") return;
    moveFromTargetToSource(selectedIdx);
  };

  // Reordering inside Target list using arrow buttons
  const handleMoveUp = () => {
    if (selectedIdx === null || selectedListType !== "target" || selectedIdx === 0) return;
    setTargetList((prev) => {
      const list = [...prev];
      const temp = list[selectedIdx];
      list[selectedIdx] = list[selectedIdx - 1];
      list[selectedIdx - 1] = temp;
      return list;
    });
    setSelectedIdx(selectedIdx - 1);
  };

  const handleMoveDown = () => {
    if (
      selectedIdx === null ||
      selectedListType !== "target" ||
      selectedIdx === targetList.length - 1
    ) {
      return;
    }
    setTargetList((prev) => {
      const list = [...prev];
      const temp = list[selectedIdx];
      list[selectedIdx] = list[selectedIdx + 1];
      list[selectedIdx + 1] = temp;
      return list;
    });
    setSelectedIdx(selectedIdx + 1);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, idx: number, source: "source" | "target") => {
    if (phase !== "question") {
      e.preventDefault();
      return;
    }
    draggedIdxRef.current = idx;
    draggedSourceRef.current = source;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    draggedIdxRef.current = null;
    draggedSourceRef.current = null;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number, targetListType: "source" | "target") => {
    e.preventDefault();
    e.stopPropagation();

    const srcIdx = draggedIdxRef.current;
    const srcListType = draggedSourceRef.current;

    if (srcIdx === null || !srcListType) return;

    if (srcListType === targetListType) {
      // Reordering within the same list
      if (srcListType === "source") {
        setSourceList((prev) => {
          const list = [...prev];
          const [moved] = list.splice(srcIdx, 1);
          list.splice(targetIdx, 0, moved);
          return list;
        });
      } else {
        setTargetList((prev) => {
          const list = [...prev];
          const [moved] = list.splice(srcIdx, 1);
          list.splice(targetIdx, 0, moved);
          return list;
        });
      }
    } else {
      // Moving between lists
      if (srcListType === "source" && targetListType === "target") {
        const item = sourceList[srcIdx];
        setSourceList((prev) => prev.filter((_, i) => i !== srcIdx));
        setTargetList((prev) => {
          const list = [...prev];
          list.splice(targetIdx, 0, item);
          return list;
        });
      } else if (srcListType === "target" && targetListType === "source") {
        const item = targetList[srcIdx];
        setTargetList((prev) => prev.filter((_, i) => i !== srcIdx));
        setSourceList((prev) => {
          const list = [...prev];
          list.splice(targetIdx, 0, item);
          return list;
        });
      }
    }

    setSelectedIdx(null);
    setSelectedListType(null);
    handleDragEnd();
  };

  const handleDropOnContainer = (e: React.DragEvent, targetListType: "source" | "target") => {
    e.preventDefault();
    const srcIdx = draggedIdxRef.current;
    const srcListType = draggedSourceRef.current;

    if (srcIdx === null || !srcListType) return;
    if (srcListType === targetListType) return; // Drop on container in same list does nothing

    if (srcListType === "source" && targetListType === "target") {
      moveFromSourceToTarget(srcIdx);
    } else if (srcListType === "target" && targetListType === "source") {
      moveFromTargetToSource(srcIdx);
    }
    handleDragEnd();
  };

  // Submit and pagination handlers
  const handleSubmit = () => {
    // Score based on correct pairs in target list
    setScores((prev) => [...prev, scoreRpAnswer(question, targetList)]);
    setFeedbackLoading(true);
    setPhase("result");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackLoading(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScores((prev) => prev.slice(0, index));
    // Re-shuffle current question
    const indices = Array.from({ length: question.paragraphs.length }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setSourceList(shuffled);
    setTargetList([]);
    setSelectedIdx(null);
    setSelectedListType(null);
    setPhase("question");
  };

  const handleNext = () => {
    if (index + 1 >= RP_QUESTIONS.length) {
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

  const isSubmitDisabled = sourceList.length > 0; // Must move all paragraphs to Target to submit

  return (
    <div onClick={handleContainerClick} className="min-h-[500px]">
      {/* Breadcrumbs */}
      <div className="text-sm font-normal text-gray-400 flex items-center">
        <Link href="/practice" className="hover:text-gray-600 transition">Practice</Link>
        <span className="mx-1.5">/</span>
        <Link href="/practice" className="hover:text-gray-600 transition">Reading</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600 font-medium">Reorder Paragraph</span>
      </div>

      {/* Header */}
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Question {index + 1} of {RP_QUESTIONS.length}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{
            width: `${((index + (phase === "result" ? 1 : 0)) / RP_QUESTIONS.length) * 100}%`,
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
              Several text boxes appear on the screen in a random order. Put the text boxes in the correct order.
              <span className="ml-2.5 inline-block align-middle">
                <InfoPopover>
                  තිරය මත අහඹු ලෙස පෙළ කොටස් කිහිපයක් දර්ශනය වේ. ඒවා නිවැරදි අනුපිළිවෙළට සකසන්න. (drag and drop මගින් හෝ ඊතල බොත්තම් භාවිතයෙන් සකස් කළ හැකිය)
                </InfoPopover>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Columns Container (breaks out of max-w-3xl to max-w-5xl width) */}
      <div className="mt-6 flex flex-col lg:flex-row gap-4 items-stretch select-none lg:-mx-32">
        
        {/* Source Panel Wrapper with spacer on the left */}
        <div className="flex-1 flex items-stretch gap-3">
          {/* Dummy spacer to match the width of the Reorder buttons on the right */}
          <div className="hidden lg:block w-11 shrink-0" aria-hidden="true" />
          
          {/* Source Panel */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnContainer(e, "source")}
            className={`flex-1 rounded-2xl border bg-gray-50/30 p-4 flex flex-col min-h-[300px] transition-colors ${
              phase === "question" ? "border-gray-200" : "border-gray-100 bg-gray-50/10"
            }`}
          >
          <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Source</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
              {sourceList.length} items
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {sourceList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-gray-400">All blocks moved to Target</p>
              </div>
            ) : (
              sourceList.map((paraIdx, idx) => {
                const isSelected = selectedIdx === idx && selectedListType === "source";
                return (
                  <div
                    key={paraIdx}
                    draggable={phase === "question"}
                    onDragStart={(e) => handleDragStart(e, idx, "source")}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx, "source")}
                    onDoubleClick={() => handleDoubleClick(idx, "source")}
                    onClick={(e) => handleSelect(idx, "source", e)}
                    className={`group relative flex items-start gap-2.5 rounded-xl border p-3.5 bg-white shadow-sm transition-all leading-relaxed ${
                      phase !== "question"
                        ? "border-gray-100 cursor-default opacity-60"
                        : isSelected
                        ? "border-primary-500 ring-2 ring-primary-500/20 cursor-grabbing"
                        : "border-gray-200 hover:border-primary-300 hover:shadow-md cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    {/* Drag Handle */}
                    {phase === "question" && (
                      <span className="shrink-0 text-gray-300 group-hover:text-primary-400 transition-colors font-mono font-bold select-none pt-0.5">
                        ☰
                      </span>
                    )}
                    <span className="text-sm text-gray-800 font-normal leading-relaxed">
                      {question.paragraphs[paraIdx]}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Transfer Button Controls */}
        <div className="flex lg:flex-col justify-center items-center gap-3 py-2 lg:py-0 shrink-0">
          {/* Desktop Right Arrow / Mobile Down Arrow */}
          <button
            type="button"
            disabled={selectedIdx === null || selectedListType !== "source" || phase !== "question"}
            onClick={handleTransferToTarget}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
              selectedIdx !== null && selectedListType === "source" && phase === "question"
                ? "bg-primary-600 border-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Move Selected to Target"
          >
            {/* Desktop right arrow, Mobile down arrow */}
            <svg className="h-5 w-5 fill-current hidden lg:block" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <svg className="h-5 w-5 fill-current block lg:hidden" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 12.586V3a1 1 0 112 0v9.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Desktop Left Arrow / Mobile Up Arrow */}
          <button
            type="button"
            disabled={selectedIdx === null || selectedListType !== "target" || phase !== "question"}
            onClick={handleTransferToSource}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
              selectedIdx !== null && selectedListType === "target" && phase === "question"
                ? "bg-primary-600 border-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Move Selected to Source"
          >
            {/* Desktop left arrow, Mobile up arrow */}
            <svg className="h-5 w-5 fill-current hidden lg:block" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <svg className="h-5 w-5 fill-current block lg:hidden" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L6.414 8H17a1 1 0 110 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Target Panel + Reorder arrows */}
        <div className="flex-1 flex items-stretch gap-3">
          
          {/* Target Container */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnContainer(e, "target")}
            className={`flex-1 rounded-2xl border bg-gray-50/30 p-4 flex flex-col min-h-[300px] transition-colors ${
              phase === "question" ? "border-gray-200" : "border-gray-100 bg-gray-50/10"
            }`}
          >
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Target</span>
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {targetList.length} items
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {targetList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-400">Drag or transfer text boxes here</p>
                </div>
              ) : (
                targetList.map((paraIdx, idx) => {
                  const isSelected = selectedIdx === idx && selectedListType === "target";
                  return (
                    <div
                      key={paraIdx}
                      draggable={phase === "question"}
                      onDragStart={(e) => handleDragStart(e, idx, "target")}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx, "target")}
                      onDoubleClick={() => handleDoubleClick(idx, "target")}
                      onClick={(e) => handleSelect(idx, "target", e)}
                      className={`group relative flex items-start gap-2.5 rounded-xl border p-3.5 bg-white shadow-sm transition-all leading-relaxed ${
                        phase !== "question"
                          ? "border-gray-100 cursor-default opacity-60"
                          : isSelected
                          ? "border-primary-500 ring-2 ring-primary-500/20 cursor-grabbing"
                          : "border-gray-200 hover:border-primary-300 hover:shadow-md cursor-grab active:cursor-grabbing"
                      }`}
                    >
                      {/* Drag Handle */}
                      {phase === "question" && (
                        <span className="shrink-0 text-gray-300 group-hover:text-primary-400 transition-colors font-mono font-bold select-none pt-0.5">
                          ☰
                        </span>
                      )}
                      <span className="text-sm text-gray-800 font-normal leading-relaxed">
                        {question.paragraphs[paraIdx]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Reordering Controls (Up / Down) */}
          <div className="flex flex-col justify-center items-center gap-3 w-11 shrink-0">
            {/* Reorder Up Button */}
            <button
              type="button"
              disabled={
                selectedIdx === null ||
                selectedListType !== "target" ||
                selectedIdx === 0 ||
                phase !== "question"
              }
              onClick={handleMoveUp}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
                selectedIdx !== null &&
                selectedListType === "target" &&
                selectedIdx > 0 &&
                phase === "question"
                  ? "bg-primary-600 border-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title="Move Up"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Reorder Down Button */}
            <button
              type="button"
              disabled={
                selectedIdx === null ||
                selectedListType !== "target" ||
                selectedIdx === targetList.length - 1 ||
                phase !== "question"
              }
              onClick={handleMoveDown}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
                selectedIdx !== null &&
                selectedListType === "target" &&
                selectedIdx < targetList.length - 1 &&
                phase === "question"
                  ? "bg-primary-600 border-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title="Move Down"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3">
          {phase === "question" ? (
            <button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer ${
                isSubmitDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 hover:shadow-md"
              }`}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 cursor-pointer"
            >
              {index + 1 >= RP_QUESTIONS.length ? "Finish Session" : "Next Question"}
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
                Analyzing paragraph flow…
              </p>
            </div>
          ) : (
            <div className="animate-feedback-reveal">
              {/* Score Overview */}
              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <RpScoreOverview score={currentScore} lang={lang} />
              </div>

              {/* Feedback and Explanations */}
              <RpFeedbackPanel
                score={currentScore}
                paragraphs={question.paragraphs}
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
  scores: RpScoreResult[];
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
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
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
        <span className="text-gray-600 font-medium">Reorder Paragraph</span>
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
              ? "විශිෂ්ටයි! සියලුම සම්බන්ධතා නිවැරදියි. මේ ආකාරයෙන්ම ඉදිරියට යන්න."
              : accuracy >= 70
              ? "බොහොම හොඳයි! ඡේද ගැලපීම පිළිබඳව ඔබට හොඳ අවබෝධයක් ඇත. වැරදුණු තැන් නැවත විවරණය කරන්න."
              : "තවදුරටත් පුහුණුවීම අවශ්‍යයි. සම්බන්ධක පද (pronouns, link words) පිළිබඳව වැඩි සැලකිල්ලක් දක්වන්න."
            : accuracy === 100
            ? "Excellent! Perfect ordering. Keep up the great work."
            : accuracy >= 70
            ? "Very good job! You have a solid grasp of paragraph flow. Review details to reach 100%."
            : "More practice needed. Pay closer attention to logical linkers and reference words."}
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
