import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function MascotReactionEmote({ emote, position = 'left' }) {
  if (!emote) return null;

  const positionClass = position === 'left' ? 'left-16 -top-6' : 'right-16 -top-6';

  const emoteIcons = {
    heart: '❤️',
    sparkle: '✨',
    lightbulb: '💡',
    happy: '😊',
    thinking: '💭',
    excited: '🤩',
    wave: '👋',
  };

  const icon = emoteIcons[emote] || '✨';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.5 }}
        animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`absolute ${positionClass} z-30 px-2 py-1 rounded-full bg-white/95 border border-amber-300 shadow-md text-sm pointer-events-none`}
      >
        <span>{icon}</span>
      </motion.div>
    </AnimatePresence>
  );
}
