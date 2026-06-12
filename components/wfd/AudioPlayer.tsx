"use client";

import type { CSSProperties } from "react";
import { useTts, COUNTDOWN_SECONDS, MAX_REPLAYS } from "@/lib/useTts";

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function AudioPlayer({
  sentence,
  paused = false,
}: {
  sentence: string;
  /** Pauses the auto-play countdown (e.g. once the answer is submitted). */
  paused?: boolean;
}) {
  const { play, isPlaying, replaysLeft, hasPlayed, countdown, supported } =
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
  const canPlay = !isCountingDown && !isPlaying && (!hasPlayed || replaysLeft > 0);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
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
          onClick={play}
          disabled={!canPlay}
          className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors duration-300 ${
            isCountingDown
              ? "cursor-default bg-brand-50 text-brand-700"
              : canPlay
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
          aria-label={
            isCountingDown
              ? `Get ready to listen, ${countdown} seconds remaining`
              : hasPlayed
                ? "Replay audio"
                : "Play audio"
          }
        >
          {isCountingDown ? (
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
          {isCountingDown
            ? "Get ready to listen"
            : isPlaying
              ? "Playing..."
              : !hasPlayed
                ? "Press play to hear the audio"
                : replaysLeft > 0
                  ? "Replay audio"
                  : "No replays left"}
        </p>
        <p className="text-xs text-slate-500">
          {!hasPlayed
            ? `Up to ${MAX_REPLAYS} replays after you listen`
            : `${replaysLeft} of ${MAX_REPLAYS} replays left`}
        </p>
      </div>
    </div>
  );
}
