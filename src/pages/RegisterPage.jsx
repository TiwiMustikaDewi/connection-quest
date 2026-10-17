import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { sound } from '../lib/sound';

import { HOMEGROUP_OPTIONS } from '../data/homegroups';

export function RegisterPage() {
  const { t } = useLanguage();
  const { state, setParticipant } = useGame();
  const navigate = useNavigate();

  const [name, setName] = useState(state.participant.name || '');
  const [homegroup, setHomegroup] = useState(state.participant.homegroup || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = t('registration.nameError');
    }
    if (!homegroup.trim()) {
      newErrors.homegroup = t('registration.homegroupError');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      localStorage.removeItem('connection_quest_reflection_v1');
    } catch (err) {
      console.warn(err);
    }

    sound.playSelect(state.soundEnabled);
    setParticipant({ name: name.trim(), homegroup: homegroup.trim() });
    navigate('/avatar');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-4 space-y-5"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">
          {t('registration.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('registration.subtitle')}
        </p>
      </div>

      <Card variant="cream" className="border-2 border-amber-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="participant-name" className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <User className="w-3.5 h-3.5 text-amber-600" />
              {t('registration.nameLabel')}
            </label>
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder={t('registration.namePlaceholder')}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-sm font-medium transition"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.name}</p>
            )}
          </div>

          {/* Homegroup Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="participant-homegroup" className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              {t('registration.homegroupLabel')}
            </label>
            <select
              id="participant-homegroup"
              value={homegroup}
              onChange={(e) => {
                setHomegroup(e.target.value);
                if (errors.homegroup) setErrors((prev) => ({ ...prev, homegroup: null }));
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-sm font-medium transition cursor-pointer"
            >
              <option value="">{t('registration.homegroupPlaceholder')}</option>
              {HOMEGROUP_OPTIONS.map((hg) => (
                <option key={hg} value={hg}>
                  {hg}
                </option>
              ))}
            </select>
            {errors.homegroup && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.homegroup}</p>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                sound.playPop(state.soundEnabled);
                navigate('/');
              }}
              icon={ArrowLeft}
              className="w-1/3"
            >
              {t('common.back')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              className="w-2/3"
            >
              {t('registration.submitButton')}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
