"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Seconds before the question audio starts playing automatically. */
export const COUNTDOWN_SECONDS = 10;

interface UseTtsOptions {
  /** Pauses the pre-play countdown (e.g. when the question is no longer active). */
  paused?: boolean;
  /** Restricts playback to once only. */
  playOnce?: boolean;
}

interface UseTtsResult {
  /** Replays the sentence. Available any time after the first play. */
  play: () => void;
  isPlaying: boolean;
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
 * auto-plays once. After that the user may replay unlimited times.
 * State resets when `sentence` changes.
 */
export function useTts(
  sentence: string,
  { paused = false, playOnce = false }: UseTtsOptions = {}
): UseTtsResult {
  const [isPlaying, setIsPlaying] = useState(false);
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
      if (e.error === "not-allowed") setHasPlayed(false);
    };
    setIsPlaying(true);
    synth.speak(utterance);
  }, []);

  // Reset state once per question.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
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

  // When paused (e.g. answer submitted), cancel any running countdown so the
  // player shows a replay button instead of a frozen timer.
  useEffect(() => {
    if (paused) setCountdown(null);
  }, [paused]);

  const play = useCallback(() => {
    if (!supported || isPlaying || countdown !== null) return;
    if (playOnce && hasPlayed) return;
    if (!hasPlayed) {
      setHasPlayed(true);
    }
    speak();
  }, [supported, isPlaying, countdown, hasPlayed, speak, playOnce]);

  return { play, isPlaying, hasPlayed, countdown, supported };
}
