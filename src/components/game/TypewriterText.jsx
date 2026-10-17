import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../lib/sound';
import { useGame } from '../../hooks/useGame';

export function TypewriterText({ text = '', speed = 22, onComplete, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const { state } = useGame();
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    let idx = 0;

    const interval = setInterval(() => {
      idx += 1;
      if (idx <= text.length) {
        setDisplayedText(text.slice(0, idx));
        if (idx % 3 === 0) {
          sound.playBlip(state.soundEnabled);
        }
      } else {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, state.soundEnabled]);

  const handleInstantComplete = () => {
    if (!isFinished) {
      setDisplayedText(text);
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div
      onClick={handleInstantComplete}
      className={`cursor-pointer select-none leading-relaxed ${className}`}
      title="Klik untuk langsung menampilkan seluruh teks"
    >
      {displayedText}
      {!isFinished && (
        <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse align-middle" />
      )}
    </div>
  );
}
