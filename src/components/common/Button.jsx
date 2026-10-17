import React from 'react';
import { motion } from 'motion/react';

const VARIANTS = {
  primary: 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold border-2 border-amber-500 shadow-bouncy active:translate-y-1',
  secondary: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-950 font-bold border-2 border-emerald-400 shadow-sm active:translate-y-0.5',
  lilac: 'bg-violet-200 hover:bg-violet-300 text-violet-950 font-bold border-2 border-violet-400 shadow-sm active:translate-y-0.5',
  outline: 'bg-white hover:bg-amber-50 text-slate-700 font-semibold border-2 border-slate-200 shadow-sm active:translate-y-0.5',
  ghost: 'bg-transparent hover:bg-amber-100/50 text-slate-600 font-medium',
  danger: 'bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold border-2 border-rose-300',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon = null,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center transition-colors cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClass}
        ${sizeClass}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
      <span>{children}</span>
    </motion.button>
  );
}
