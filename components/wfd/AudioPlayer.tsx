"use client";

import type { CSSProperties } from "react";
import { useTts, COUNTDOWN_SECONDS } from "@/lib/useTts";
import type { FeedbackLang } from "@/lib/feedback";

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function AudioPlayer({
  sentence,
  paused = false,
  onRestart,
  lang = "si",
}: {
  sentence: string;
  /** Pauses the auto-play countdown (e.g. once the answer is submitted). */
  paused?: boolean;
  onRestart?: () => void;
  lang?: FeedbackLang;
}) {
  const { play, isPlaying, hasPlayed, countdown, supported } =
    useTts(sentence, { paused });

  if (!supported) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p>Your browser does not support audio playback (speech synthesis).</p>
        <p className="sinhala mt-1">
          ඔබේ browser එක audio වාදනයට සහාය නොදක්වයි. Chrome හෝ Edge භාවිතා
          කරන්න.
        </p>
      </div>
    );
  }

  const isCountingDown = countdown !== null;
  const canPlay = !isCountingDown && !isPlaying;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="relative h-12 w-12 shrink-0">
        {/* Countdown progress ring; fades out when the countdown finishes */}
        <svg
          viewBox="0 0 56 56"
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-1 h-14 w-14 -rotate-90 transition-opacity duration-500 ${
            isCountingDown ? "opacity-100" : "opacity-0"
          }`}
        >
          <circle
            cx="28"
            cy="28"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="3"
            className="stroke-brand-100"
          />
          {isCountingDown && (
            <circle
              cx="28"
              cy="28"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-brand-500"
              style={
                {
                  "--countdown-ring-circumference": RING_CIRCUMFERENCE,
                  strokeDasharray: RING_CIRCUMFERENCE,
                  animation: `countdown-ring ${COUNTDOWN_SECONDS}s linear forwards`,
                  animationPlayState: paused ? "paused" : "running",
                } as CSSProperties
              }
            />
          )}
        </svg>
        <button
          type="button"
          onClick={onRestart || play}
          disabled={!onRestart && !canPlay}
          className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors duration-300 ${
            onRestart
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : isCountingDown
                ? "cursor-default bg-brand-50 text-brand-700"
                : canPlay
                  ? "bg-brand-500 text-white hover:bg-brand-600"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
          aria-label={
            onRestart
              ? "Restart question"
              : isCountingDown
                ? `Get ready to listen, ${countdown} seconds remaining`
                : hasPlayed
                  ? "Replay audio"
                  : "Play audio"
          }
        >
          {onRestart ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          ) : isCountingDown ? (
            <span
              key={countdown}
              className="text-lg font-bold tabular-nums"
              style={{ animation: "countdown-tick 300ms ease-out" }}
            >
              {countdown}
            </span>
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M8.25 4.5a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75zm7.5 0a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
            </svg>
          )}
        </button>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-normal text-slate-600">
          {onRestart
            ? "Restart question"
            : isCountingDown
              ? "Get ready to listen"
              : isPlaying
                ? "Playing..."
                : paused || hasPlayed
                  ? "Replay audio"
                  : "Press play to hear the audio"}
        </p>
      </div>
    </div>
  );
}
