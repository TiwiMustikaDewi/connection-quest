import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AvatarSprite } from '../components/characters/AvatarSprite';
import { sound } from '../lib/sound';

export function ProloguePage() {
  const { t, language } = useLanguage();
  const { state, setScene } = useGame();
  const navigate = useNavigate();

  const isIndo = language === 'id';
  const avatarName = state.participant.avatarId
    ? state.participant.avatarId.charAt(0).toUpperCase() + state.participant.avatarId.slice(1)
    : 'Milo';

  const handleBegin = () => {
    sound.playSparkle(state.soundEnabled);
    setScene('ch1_intro', 1);
    navigate('/game');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full py-4 space-y-4"
    >
      <div className="text-center space-y-1">
        <Badge variant="yellow" icon={Sparkles} className="text-xs">
          Connectopia • Prologue
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
          {t('prologue.title')}
        </h2>
      </div>

      <Card variant="glass" className="border-2 border-amber-200/80 p-6 space-y-4 shadow-soft">
        {/* Animated Avatar Mascot Companion */}
        <div className="flex flex-col items-center justify-center py-2">
          <AvatarSprite avatarId={state.participant.avatarId || 'milo'} className="w-28 h-28" />
          <span className="text-xs font-bold text-amber-900 bg-amber-200/90 px-3 py-0.5 rounded-full border border-amber-400 mt-2 shadow-2xs">
            {avatarName}
          </span>
        </div>

        {/* Narrative Intro Box */}
        <div className="bg-white/85 rounded-2xl p-4 border border-amber-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5">
          <p className="font-semibold text-slate-800">
            {isIndo
              ? `Halo, ${state.participant.name || 'Petualang'}! Bersama ${avatarName}, kamu baru saja melangkahkan kaki ke gerbang Connectopia.`
              : `Hello, ${state.participant.name || 'Adventurer'}! Accompanied by ${avatarName}, you have just stepped into Connectopia.`}
          </p>
          <p className="text-slate-600">
            {isIndo
              ? 'Warga sedang bersiap menyambut Harmony Festival. Di 3 lokasi (Town Square, Quiet Garden, dan Community Workshop), kamu akan dihadapkan pada 9 situasi komunikasi nyata.'
              : 'The townsfolk are gearing up for the Harmony Festival. Across 3 key areas, you will navigate 9 real communicative situations.'}
          </p>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
            💡 {isIndo
              ? 'Tidak ada pilihan salah! Setiap keputusan adalah cermin cara unikmu terhubung dengan orang lain.'
              : 'There are no wrong choices! Every decision reflects your unique way of forging connections.'}
          </div>
        </div>
      </Card>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => {
            sound.playPop(state.soundEnabled);
            navigate('/avatar');
          }}
          icon={ArrowLeft}
          className="w-1/3"
        >
          {t('common.back')}
        </Button>
        <Button
          variant="primary"
          onClick={handleBegin}
          icon={ArrowRight}
          className="w-2/3"
        >
          {isIndo ? 'Mulai Bab 1' : 'Start Chapter 1'}
        </Button>
      </div>
    </motion.div>
  );
}
