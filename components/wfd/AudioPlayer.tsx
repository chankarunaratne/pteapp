"use client";

import InfoPopover from "@/components/InfoPopover";
import { useTts, MAX_REPLAYS } from "@/lib/useTts";

export default function AudioPlayer({ sentence }: { sentence: string }) {
  const { play, isPlaying, replaysLeft, hasPlayed, supported } =
    useTts(sentence);

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

  const canPlay = !isPlaying && (!hasPlayed || replaysLeft > 0);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <button
        type="button"
        onClick={play}
        disabled={!canPlay}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${
          canPlay
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400"
        }`}
        aria-label={hasPlayed ? "Replay audio" : "Play audio"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M8.25 4.5a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75zm7.5 0a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V5.25a.75.75 0 00-.75-.75z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
          </svg>
        )}
      </button>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">
          {isPlaying
            ? "Playing..."
            : !hasPlayed
              ? "Press play when you're ready"
              : replaysLeft > 0
                ? "Replay audio"
                : "No replays left"}{" "}
          <InfoPopover>
            {!hasPlayed
              ? "සූදානම් වුණාම play ඔබන්න — පසුව තවත් වතාවන් දෙකක් අහන්න පුළුවන්"
              : replaysLeft > 0
                ? `ඔබට තව වතාවන් ${replaysLeft}ක් අහන්න පුළුවන්`
                : "තවත් අහන්න බැහැ — දැන් ලියන්න"}
          </InfoPopover>
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
