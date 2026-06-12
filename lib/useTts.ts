"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_REPLAYS = 2;
/** Seconds before the question audio starts playing automatically. */
export const COUNTDOWN_SECONDS = 10;

interface UseTtsOptions {
  /** Pauses the pre-play countdown (e.g. when the question is no longer active). */
  paused?: boolean;
}

interface UseTtsResult {
  /** Replays the sentence. Only available after the first (automatic) play. */
  play: () => void;
  isPlaying: boolean;
  /** Replays remaining after the first play. */
  replaysLeft: number;
  /** Whether the sentence has played at least once. */
  hasPlayed: boolean;
  /** Seconds until the audio auto-plays, or null once the countdown is done. */
  countdown: number | null;
  supported: boolean;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

/**
 * Browser TTS for one WFD question. Counts down COUNTDOWN_SECONDS, then
 * auto-plays once. After that the user may replay up to MAX_REPLAYS times.
 * State resets when `sentence` changes.
 */
export function useTts(
  sentence: string,
  { paused = false }: UseTtsOptions = {}
): UseTtsResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(COUNTDOWN_SECONDS);
  const [supported, setSupported] = useState(true);
  const sentenceRef = useRef(sentence);
  sentenceRef.current = sentence;

  const speak = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(sentenceRef.current);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      setIsPlaying(false);
      // Browsers can block speech started without a user gesture (e.g. right
      // after a hard refresh). Fall back to a manual first play that doesn't
      // cost a replay.
      if (e.error === "not-allowed") setHasPlayed(false);
    };
    // Optimistic, so the replay button locks before `onstart` fires.
    setIsPlaying(true);
    synth.speak(utterance);
  }, []);

  // Reset state once per question.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setReplaysLeft(MAX_REPLAYS);
    setHasPlayed(false);
    setCountdown(COUNTDOWN_SECONDS);

    return () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, [sentence]);

  // Tick the countdown, then auto-play once it reaches zero.
  useEffect(() => {
    if (!supported || paused || countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      setHasPlayed(true);
      speak();
      return;
    }
    const timer = setTimeout(
      () => setCountdown((c) => (c === null ? null : c - 1)),
      1000
    );
    return () => clearTimeout(timer);
  }, [supported, paused, countdown, speak]);

  const play = useCallback(() => {
    if (!supported || isPlaying || countdown !== null) return;
    if (hasPlayed && replaysLeft <= 0) return;
    if (hasPlayed) {
      setReplaysLeft((n) => n - 1);
    } else {
      // Only reachable when the automatic play was blocked by the browser.
      setHasPlayed(true);
    }
    speak();
  }, [supported, isPlaying, countdown, hasPlayed, replaysLeft, speak]);

  return { play, isPlaying, replaysLeft, hasPlayed, countdown, supported };
}
