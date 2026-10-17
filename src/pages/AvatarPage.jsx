import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MiloSprite, LumiSprite, KikoSprite } from '../components/characters/AvatarSprite';
import { sound } from '../lib/sound';

const AVATARS = [
  {
    id: 'milo',
    nameKey: 'avatar.milo.name',
    roleKey: 'avatar.milo.role',
    descKey: 'avatar.milo.desc',
    traitKey: 'avatar.milo.trait',
    quoteId: '"Ayo senyum dan sapa semua orang dengan hangat! ☀️"',
    quoteEn: '"Let us smile and greet everyone warmly! ☀️"',
    variant: 'milo',
    badgeVariant: 'yellow',
    Component: MiloSprite,
  },
  {
    id: 'lumi',
    nameKey: 'avatar.lumi.name',
    roleKey: 'avatar.lumi.role',
    descKey: 'avatar.lumi.desc',
    traitKey: 'avatar.lumi.trait',
    quoteId: '"Dengarkan perlahan, setiap orang punya cerita berharga. 🌿"',
    quoteEn: '"Listen gently, every person carries a precious story. 🌿"',
    variant: 'lumi',
    badgeVariant: 'mint',
    Component: LumiSprite,
  },
  {
    id: 'kiko',
    nameKey: 'avatar.kiko.name',
    roleKey: 'avatar.kiko.role',
    descKey: 'avatar.kiko.desc',
    traitKey: 'avatar.kiko.trait',
    quoteId: '"Jadilah berani dan autentik, coba hal baru bersama! ✨"',
    quoteEn: '"Be brave and authentic, let us discover new horizons! ✨"',
    variant: 'kiko',
    badgeVariant: 'lilac',
    Component: KikoSprite,
  },
];

export function AvatarPage() {
  const { t, language } = useLanguage();
  const { state, selectAvatar } = useGame();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(state.participant.avatarId || 'milo');
  const isIndo = language === 'id';

  // Route Guard: Must register name & homegroup first
  React.useEffect(() => {
    if (!state.participant.name || !state.participant.homegroup) {
      navigate('/register', { replace: true });
    }
  }, [state.participant.name, state.participant.homegroup, navigate]);

  const handleSelect = (id) => {
    sound.playSelect(state.soundEnabled);
    setSelectedId(id);
  };

  const handleContinue = () => {
    sound.playPop(state.soundEnabled);
    selectAvatar(selectedId);
    navigate('/prologue');
  };

  const currentAvatar = AVATARS.find((a) => a.id === selectedId) || AVATARS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-4 space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">
          {t('avatar.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('avatar.subtitle')}
        </p>
      </div>

      {/* Selected Companion Quote Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="text-center p-3 rounded-2xl bg-amber-100/80 border border-amber-300 shadow-2xs"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
            <span>{isIndo ? currentAvatar.quoteId : currentAvatar.quoteEn}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Avatar Cards Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {AVATARS.map((av) => {
          const isSelected = selectedId === av.id;
          const SpriteComp = av.Component;

          return (
            <Card
              key={av.id}
              variant={av.variant}
              interactive
              onClick={() => handleSelect(av.id)}
              className={`
                relative flex flex-col items-center text-center p-4 transition-all
                ${isSelected ? 'ring-3 ring-amber-400 border-amber-400 scale-[1.02] shadow-md' : 'opacity-85 hover:opacity-100'}
              `}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="h-28 flex items-center justify-center my-1">
                <SpriteComp className="w-24 h-24" animated={isSelected} />
              </div>

              <div className="space-y-1 w-full mt-2">
                <h3 className="font-bold text-base text-slate-800 font-display">
                  {t(av.nameKey)}
                </h3>
                <Badge variant={av.badgeVariant} className="text-[10px] py-0.5">
                  {t(av.traitKey)}
                </Badge>
                <p className="text-[11px] text-slate-600 line-clamp-2 pt-1 leading-snug">
                  {t(av.descKey)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => {
            sound.playPop(state.soundEnabled);
            navigate('/register');
          }}
          icon={ArrowLeft}
          className="w-1/3"
        >
          {t('common.back')}
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          icon={ArrowRight}
          className="w-2/3"
        >
          {t('common.continue')}
        </Button>
      </div>
    </motion.div>
  );
}
