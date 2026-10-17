import React from 'react';
import { motion } from 'motion/react';

const CARD_VARIANTS = {
  cream: 'bg-white/90 border-2 border-amber-100 shadow-soft',
  glass: 'glass-panel shadow-soft',
  milo: 'bg-amber-50/90 border-2 border-amber-200 shadow-soft',
  lumi: 'bg-emerald-50/90 border-2 border-emerald-200 shadow-soft',
  kiko: 'bg-violet-50/90 border-2 border-violet-200 shadow-soft',
  neutral: 'bg-white border border-slate-200 shadow-sm',
};

export function Card({
  children,
  variant = 'cream',
  className = '',
  interactive = false,
  onClick,
  ...props
}) {
  const variantClass = CARD_VARIANTS[variant] || CARD_VARIANTS.cream;
  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive
    ? {
        whileHover: { y: -3, scale: 1.01 },
        whileTap: { scale: 0.99 },
        transition: { type: 'spring', stiffness: 350, damping: 20 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-3xl p-5 md:p-6 transition-all
        ${interactive ? 'cursor-pointer' : ''}
        ${variantClass}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
