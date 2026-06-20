"use client";

import type { HiwWordFeedback } from "@/lib/hiwScoring";

export default function HiwTranscript({
  transcript,
  selectedIndices,
  onChange,
  feedbacks,
  disabled = false,
}: {
  transcript: string;
  selectedIndices: number[];
  onChange: (indices: number[]) => void;
  feedbacks?: HiwWordFeedback[];
  disabled?: boolean;
}) {
  const tokens = transcript.split(/\s+/);

  const handleWordClick = (index: number) => {
    if (disabled || feedbacks) return;

    if (selectedIndices.includes(index)) {
      onChange(selectedIndices.filter((i) => i !== index));
    } else {
      onChange([...selectedIndices, index]);
    }
  };

  return (
    <div className="text-[15px] sm:text-base leading-relaxed text-gray-800 tracking-normal select-none font-normal">
      {tokens.map((token, index) => {
        const isSelected = selectedIndices.includes(index);
        const feedback = feedbacks?.[index];

        let wordClass = "";
        let prefix = "";

        if (feedback) {
          // Result mode styling
          if (feedback.status === "correct-identified") {
            wordClass = "bg-green-150 text-green-950 font-medium border-b border-green-600";
            prefix = "✓ ";
          } else if (feedback.status === "incorrect-selected") {
            wordClass = "bg-red-100 text-red-950 font-medium border-b border-red-600";
            prefix = "✗ ";
          } else if (feedback.status === "missed") {
            wordClass = "bg-amber-100 text-amber-950 font-medium border-b border-dashed border-amber-600";
          } else {
            wordClass = "text-gray-800/60";
          }
        } else {
          // Question mode styling
          if (isSelected) {
            wordClass = "bg-[#fcf3a1] text-gray-950 border border-[#e2d887] font-normal";
          } else {
            wordClass = disabled
              ? "text-gray-500"
              : "hover:bg-gray-200/60 text-gray-800 cursor-pointer";
          }
        }

        return (
          <span key={index} className="inline">
            <span
              role="button"
              tabIndex={disabled || feedbacks ? -1 : 0}
              onClick={() => handleWordClick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleWordClick(index);
                }
              }}
              className={`
                inline rounded px-0.5 py-0.5 transition-all duration-150 outline-none
                ${wordClass}
                ${!disabled && !feedbacks ? "focus-visible:ring-1 focus-visible:ring-primary-500" : ""}
              `}
            >
              {prefix}
              {token}
            </span>
            {index < tokens.length - 1 && " "}
          </span>
        );
      })}
    </div>
  );
}
