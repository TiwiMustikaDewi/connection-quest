import React from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function ConfirmResetModal({ isOpen, onClose, onConfirm }) {
  const { t, language } = useLanguage();
  const isIndo = language === 'id';

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-300 text-center space-y-4 my-auto relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-100 text-rose-600 border-2 border-rose-200 flex items-center justify-center shadow-xs">
          <RotateCcw className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-extrabold text-lg text-slate-800 font-display">
            {isIndo ? 'Ulangi Permainan dari Awal?' : 'Restart Connection Quest?'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isIndo
              ? 'Apakah kamu yakin ingin mengulang dari awal? Semua pilihan cerita, skor game, dan komitmen saat ini akan direset.'
              : 'Are you sure you want to restart? All your story choices, arcade score, and pledge will be cleared.'}
          </p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="flex-1 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition cursor-pointer active:scale-95"
          >
            {isIndo ? 'Ya, Ulangi' : 'Yes, Restart'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
