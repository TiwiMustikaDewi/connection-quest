import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, Send, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { sound } from '../lib/sound';

const SIGNATURE_POWERS = [
  { id: 'listener', labelId: 'Pendengar Penuh Perhatian', labelEn: 'Attentive Active Listener' },
  { id: 'welcomer', labelId: 'Penyapa Penuh Hangat', labelEn: 'Warm Social Welcomer' },
  { id: 'bridge', labelId: 'Penjembatan Kolaboratif', labelEn: 'Collaborative Bridge Builder' },
  { id: 'authentic', labelId: 'Penjelajah Otentik', labelEn: 'Authentic Ally' },
];

const LIMITS = {
  targetEnvironment: 60,
  strategyToPractice: 80,
  nextAction: 120,
};

export function ReflectionPage() {
  const { language } = useLanguage();
  const { state } = useGame();
  const navigate = useNavigate();

  const isIndo = language === 'id';

  const [formData, setFormData] = useState({
    targetEnvironment: '',
    signaturePower: 'listener',
    strategyToPractice: '',
    nextAction: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, val) => {
    const max = LIMITS[field] || 200;
    const truncated = val.slice(0, max);
    setFormData((prev) => ({ ...prev, [field]: truncated }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.targetEnvironment.trim()) {
      newErrors.targetEnvironment = isIndo ? 'Wajib diisi lingkungan sasaranmu' : 'Required target environment';
    }
    if (!formData.strategyToPractice.trim()) {
      newErrors.strategyToPractice = isIndo ? 'Wajib diisi strategi komunikasi pilihanmu' : 'Required strategy';
    }
    if (!formData.nextAction.trim()) {
      newErrors.nextAction = isIndo ? 'Wajib diisi satu tindakan konkret dalam 48 jam' : 'Required 48-hour action';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save reflection to local storage session
    try {
      localStorage.setItem('connection_quest_reflection_v1', JSON.stringify(formData));
    } catch {
      // fallback
    }

    sound.playSparkle(state.soundEnabled);
    navigate('/completion');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-4 space-y-4"
    >
      {/* Title Header */}
      <div className="text-center space-y-1">
        <Badge variant="mint" icon={FileText}>
          AFL Winter Peak 2026 • Capacity Building 1
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
          Personal Connection Map
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {isIndo
            ? 'Rancang satu komitmen konkret secara kreatif agar tersusun rapi pada kartu dokumentasi resmi.'
            : 'Design one concrete commitment creatively so it displays neatly on your official documentation card.'}
        </p>
      </div>

      {/* Main Interactive Form Card */}
      <Card variant="cream" className="border-2 border-emerald-300/80 p-5 sm:p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Signature Superpower Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isIndo ? 'Gaya Kekuatan Koneksi Pilihanmu' : 'Your Signature Connection Power'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SIGNATURE_POWERS.map((pow) => (
                <button
                  key={pow.id}
                  type="button"
                  onClick={() => handleChange('signaturePower', pow.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition cursor-pointer flex items-center justify-between ${
                    formData.signaturePower === pow.id
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{isIndo ? pow.labelId : pow.labelEn}</span>
                  {formData.signaturePower === pow.id && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Target Environment (Max 60 chars) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[10px] flex items-center justify-center font-bold">1</span>
                {isIndo ? 'Lingkungan Sosial Sasaran' : 'Target Social Environment'}
              </label>
              <span className={`text-[10px] font-mono font-semibold ${
                formData.targetEnvironment.length >= LIMITS.targetEnvironment ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.targetEnvironment.length}/{LIMITS.targetEnvironment}
              </span>
            </div>
            <input
              type="text"
              maxLength={LIMITS.targetEnvironment}
              value={formData.targetEnvironment}
              onChange={(e) => handleChange('targetEnvironment', e.target.value)}
              placeholder={isIndo ? 'Misal: Homegroup 13, rekan divisi, atau teman satu proyek' : 'E.g., Homegroup 13, division team, or project peers'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 font-medium"
            />
            {errors.targetEnvironment && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.targetEnvironment}</p>
            )}
          </div>

          {/* 2. Communication Strategy (Max 80 chars) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[10px] flex items-center justify-center font-bold">2</span>
                {isIndo ? 'Strategi Komunikasi yang Dipraktikkan' : 'Communication Strategy to Practice'}
              </label>
              <span className={`text-[10px] font-mono font-semibold ${
                formData.strategyToPractice.length >= LIMITS.strategyToPractice ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.strategyToPractice.length}/{LIMITS.strategyToPractice}
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={LIMITS.strategyToPractice}
              value={formData.strategyToPractice}
              onChange={(e) => handleChange('strategyToPractice', e.target.value)}
              placeholder={isIndo ? 'Misal: Active listening dengan kontak mata hangat dan bertanya pertanyaan terbuka' : 'E.g., Active listening with warm eye contact and open questions'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 font-medium resize-none"
            />
            {errors.strategyToPractice && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.strategyToPractice}</p>
            )}
          </div>

          {/* 3. Concrete 48-Hour Next Action Pledge (Max 120 chars) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[10px] flex items-center justify-center font-bold">3</span>
                {isIndo ? 'Satu Tindakan Nyata dalam 48 Jam (Pledge)' : 'One Concrete 48-Hour Action Pledge'}
              </label>
              <span className={`text-[10px] font-mono font-semibold ${
                formData.nextAction.length >= LIMITS.nextAction ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.nextAction.length}/{LIMITS.nextAction}
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={LIMITS.nextAction}
              value={formData.nextAction}
              onChange={(e) => handleChange('nextAction', e.target.value)}
              placeholder={isIndo ? 'Misal: Mengirim pesan sapaan hangat kepada 2 teman kelompok dan mengajak ngobrol santai tanpa gadget.' : 'E.g., Send a warm greeting message to 2 peers and invite them for a distraction-free chat.'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 font-medium resize-none"
            />
            {errors.nextAction && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.nextAction}</p>
            )}
            <p className="text-[10px] text-slate-400 italic">
              {isIndo
                ? 'Teks dibatasi hingga 120 karakter agar hasil kartu Story tampil proporsional, rapi, dan mudah dibaca.'
                : 'Limited to 120 characters to ensure your Story card output remains crisp, proportional, and legible.'}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                sound.playPop(state.soundEnabled);
                navigate('/ending');
              }}
              icon={ArrowLeft}
              className="w-1/3 text-xs"
            >
              {isIndo ? 'Kembali' : 'Back'}
            </Button>
            <Button
              type="submit"
              variant="secondary"
              icon={Send}
              className="w-2/3 text-xs font-bold py-3"
            >
              {isIndo ? 'Buat Kartu Dokumentasi Resmi' : 'Generate Official Document Card'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
