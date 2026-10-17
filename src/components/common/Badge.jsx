import React from 'react';

const BADGE_VARIANTS = {
  yellow: 'bg-amber-100 text-amber-800 border-amber-300',
  mint: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  lilac: 'bg-violet-100 text-violet-800 border-violet-300',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-sky-100 text-sky-800 border-sky-300',
};

export function Badge({ children, variant = 'yellow', className = '', icon: Icon = null }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.yellow;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        border ${variantClass} ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
