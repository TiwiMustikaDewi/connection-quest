import React from 'react';
import { motion } from 'motion/react';

export function ProgressBar({ current = 1, total = 3, label = '' }) {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-amber-100/80 rounded-full p-0.5 border border-amber-200 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-inner"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
