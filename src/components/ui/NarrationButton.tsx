import { useEffect, useRef, useState } from 'react';

interface NarrationButtonProps {
  /** Paragraphs to read aloud */
  text: string[];
  title: string;
}

/**
 * Reads the fable aloud using the browser's Web Speech API (no audio files).
 * Gracefully hides itself if speech synthesis is unavailable.
 */
export default function NarrationButton({ text, title }: NarrationButtonProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop narration if the fable changes (navigating between places).
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
    };
  }, [text]);

  if (!supported) return null;

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${title}. ${text.join(' ')}`);
    u.rate = 0.92;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    synth.speak(u);
    setSpeaking(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <button
      type="button"
      onClick={speaking ? stop : start}
      className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/20"
      aria-pressed={speaking}
    >
      {speaking ? (
        <>
          <span aria-hidden>◼</span> Stop narration
        </>
      ) : (
        <>
          <span aria-hidden>▶</span> Narrate the fable
        </>
      )}
    </button>
  );
}
