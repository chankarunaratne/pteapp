"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_REPLAYS = 2;

interface UseTtsResult {
  /** Plays the sentence. Counts against replays after the first manual play. */
  play: () => void;
  isPlaying: boolean;
  /** Replays remaining after the first play. */
  replaysLeft: number;
  /** Whether the user has played the sentence at least once. */
  hasPlayed: boolean;
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
 * Browser TTS for one WFD question. Plays on manual request, then allows
 * up to MAX_REPLAYS replays. State resets when `sentence` changes.
 */
export function useTts(sentence: string): UseTtsResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [hasPlayed, setHasPlayed] = useState(false);
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

  // Reset state once per question.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setReplaysLeft(MAX_REPLAYS);
    setHasPlayed(false);

    return () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, [sentence]);

  const play = useCallback(() => {
    if (!supported || isPlaying) return;
    if (hasPlayed && replaysLeft <= 0) return;
    if (hasPlayed) {
      setReplaysLeft((n) => n - 1);
    } else {
      setHasPlayed(true);
    }
    speak();
  }, [supported, isPlaying, hasPlayed, replaysLeft, speak]);

  return { play, isPlaying, replaysLeft, hasPlayed, supported };
}
