import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, ArrowRight, Sparkles, Heart, Compass, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AvatarSprite } from '../components/characters/AvatarSprite';
import { ENDINGS_DATA, calculateEnding } from '../data/chapters/storyData';
import { sound } from '../lib/sound';

export function EndingPage() {
  const { language } = useLanguage();
  const { state, setEnding } = useGame();
  const navigate = useNavigate();

  const isIndo = language === 'id';

  // Determine ending
  const endingKey = state.ending || calculateEnding(state.indicators);
  const endingData = ENDINGS_DATA[endingKey] || ENDINGS_DATA.curious_explorer;

  useEffect(() => {
    sound.playSparkle(state.soundEnabled);
    if (!state.ending) {
      setEnding(endingKey);
    }
  }, [endingKey, state.ending, state.soundEnabled, setEnding]);

  const indicators = state.indicators || { initiative: 0, empathy: 0, adaptability: 0, authenticity: 0 };
  const totalScore = indicators.initiative + indicators.empathy + indicators.adaptability + indicators.authenticity || 1;

  const scoreStats = [
    { key: 'empathy', label: isIndo ? 'Empati' : 'Empathy', value: indicators.empathy, icon: Heart, color: 'bg-rose-400' },
    { key: 'initiative', label: isIndo ? 'Inisiatif' : 'Initiative', value: indicators.initiative, icon: Compass, color: 'bg-amber-400' },
    { key: 'adaptability', label: isIndo ? 'Adaptabilitas' : 'Adaptability', value: indicators.adaptability, icon: Sparkles, color: 'bg-emerald-400' },
    { key: 'authenticity', label: isIndo ? 'Otentisitas' : 'Authenticity', value: indicators.authenticity, icon: Shield, color: 'bg-indigo-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full py-4 space-y-4"
    >
      <div className="text-center space-y-1">
        <Badge variant="yellow" icon={Award} className="text-xs">
          Connectopia • Final Reflection
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
          {isIndo ? endingData.titleId : endingData.titleEn}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-amber-700">
          {isIndo ? endingData.subtitleId : endingData.subtitleEn}
        </p>
      </div>

      {/* Main Ending Card */}
      <Card variant="glass" className="border-2 border-amber-200/90 text-center p-5 sm:p-6 space-y-4">
        {/* Animated Avatar Mascot */}
        <div className="flex flex-col items-center justify-center">
          <AvatarSprite avatarId={state.participant.avatarId || 'milo'} className="w-28 h-28" />
          <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 mt-2">
            {state.participant.name || 'Participant'} • {state.participant.homegroup || 'Connectopia'}
          </span>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
          {isIndo ? endingData.descId : endingData.descEn}
        </p>

        {/* Strengths Badges */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-700 mb-2">
            {isIndo ? 'Kekuatan Komunikasimu:' : 'Your Connection Strengths:'}
          </h4>
          <div className="flex flex-wrap justify-center gap-1.5">
            {(isIndo ? endingData.strengthsId : endingData.strengthsEn).map((str, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-amber-200 text-slate-700 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {str}
              </span>
            ))}
          </div>
        </div>

        {/* Indicator Points Breakdown */}
        <div className="pt-2 border-t border-amber-100 text-left space-y-2">
          <h4 className="text-xs font-bold text-slate-700">
            {isIndo ? 'Peta Indikator Pembelajaran:' : 'Learning Indicators Map:'}
          </h4>
          <div className="space-y-1.5">
            {scoreStats.map((item) => {
              const Icon = item.icon;
              const percent = Math.min(Math.round((item.value / Math.max(totalScore, 1)) * 100), 100);

              return (
                <div key={item.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Icon className="w-3 h-3 text-slate-500" />
                      {item.label}
                    </span>
                    <span>+{item.value} pts</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(percent, 15)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Action to Personal Connection Map CTA */}
      <div className="pt-2">
        <Button
          variant="primary"
          onClick={() => {
            sound.playPop(state.soundEnabled);
            navigate('/reflection');
          }}
          icon={ArrowRight}
          className="w-full py-3.5 text-base"
        >
          {isIndo ? 'Lanjut ke Personal Connection Map' : 'Continue to Personal Connection Map'}
        </Button>
      </div>
    </motion.div>
  );
}
