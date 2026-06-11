"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_REPLAYS = 2;

interface UseTtsResult {
  /** Plays the sentence. Counts against replays unless it's the auto-play. */
  play: () => void;
  isPlaying: boolean;
  /** Replays remaining after the initial auto-play. */
  replaysLeft: number;
  /** Whether the initial auto-play has happened. */
  hasAutoPlayed: boolean;
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
 * Browser TTS for one WFD question. Auto-plays once on mount, then allows
 * up to MAX_REPLAYS manual replays. State resets when `sentence` changes.
 */
export function useTts(sentence: string): UseTtsResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
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
    utterance.onerror = () => setIsPlaying(false);
    synth.speak(utterance);
  }, []);

  // Reset + auto-play once per question.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setReplaysLeft(MAX_REPLAYS);
    setHasAutoPlayed(false);

    // Voices may load asynchronously; wait briefly so a proper English
    // voice is used for the auto-play.
    let cancelled = false;
    const autoPlay = () => {
      if (cancelled) return;
      setHasAutoPlayed(true);
      speak();
    };
    const timer = window.setTimeout(autoPlay, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, [sentence, speak]);

  const play = useCallback(() => {
    if (!supported || isPlaying || replaysLeft <= 0) return;
    setReplaysLeft((n) => n - 1);
    speak();
  }, [supported, isPlaying, replaysLeft, speak]);

  return { play, isPlaying, replaysLeft, hasAutoPlayed, supported };
}
