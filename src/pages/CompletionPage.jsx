import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  Trophy,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ConfirmResetModal } from '../components/common/ConfirmResetModal';
import { ENDINGS_DATA } from '../data/chapters/storyData';
import { sound } from '../lib/sound';
import { calculateTotalScore } from '../lib/scoring';
import { submitParticipantQuest } from '../services/submissionService';
import { generateStoryCanvas } from '../lib/storyCanvas';

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function PersonCardIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="7" r="4.2" />
      <path d="M4 19.5C4 15.6 7.5 13.5 12 13.5C16.5 13.5 20 15.6 20 19.5V20H4V19.5Z" />
    </svg>
  );
}

function TargetCardIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="M15 9L20 4" />
    </svg>
  );
}

function StarCardIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Cute Hero Mascot for On-Screen Preview matching the Inspo
function PreviewHeroMascot({ avatarId = 'milo' }) {
  const norm = (avatarId || 'milo').toLowerCase();

  if (norm === 'lumi') {
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
          {/* Ground shadow beneath feet */}
          <ellipse cx="110" cy="226" rx="64" ry="11" fill="#0F172A" opacity="0.22" />
          {/* Cute Mint Stubby Feet */}
          <ellipse cx="80" cy="216" rx="20" ry="10" fill="#34D399" />
          <ellipse cx="140" cy="216" rx="20" ry="10" fill="#34D399" />
          {/* Lumi Gumdrop Droplet Body */}
          <path
            d="M 52 182 C 40 120 60 70 110 70 C 160 70 180 120 168 182 C 162 205 145 214 110 214 C 75 214 58 205 52 182 Z"
            fill="#A7F3D0"
          />
          {/* Specular highlight on top-left of head */}
          <ellipse cx="86" cy="100" rx="22" ry="13" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 86 100)" />
          {/* Soft Pink Blush */}
          <ellipse cx="72" cy="162" rx="12" ry="8" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="148" cy="162" rx="12" ry="8" fill="#FDA4AF" opacity="0.85" />
          {/* Big Anime Eyes with double reflections */}
          <circle cx="86" cy="144" r="12" fill="#0F172A" />
          <circle cx="83" cy="140" r="4.5" fill="#FFFFFF" />
          <circle cx="89" cy="147" r="2.2" fill="#FFFFFF" />
          <circle cx="134" cy="144" r="12" fill="#0F172A" />
          <circle cx="131" cy="140" r="4.5" fill="#FFFFFF" />
          <circle cx="137" cy="147" r="2.2" fill="#FFFFFF" />
          {/* Sweet gentle smile */}
          <path d="M 104 158 Q 110 165 116 158" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Left Waving Arm */}
          <motion.g
            animate={{ rotate: [0, 10, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '52px 145px' }}
          >
            <path d="M 52 145 Q 26 115 16 88" stroke="#34D399" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="16" cy="88" r="8" fill="#6EE7B7" />
          </motion.g>
          {/* Right Arm holding phone */}
          <path d="M 166 152 Q 180 142 188 130" stroke="#34D399" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* White Smartphone with dark outline */}
          <rect x="186" y="74" width="46" height="78" rx="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
          <rect x="190" y="80" width="38" height="62" rx="6" fill="#FFFBEB" />
          <circle cx="209" cy="111" r="13" fill="#F43F5E" />
          <path d="M 204 110 C 204 106 209 104 209 107 C 209 104 214 106 214 110 C 214 114 209 118 209 118 Z" fill="#FFFFFF" />
          {/* 3 vibration marks */}
          <line x1="208" y1="62" x2="216" y2="48" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="218" y1="64" x2="228" y2="50" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="226" y1="70" x2="236" y2="58" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (norm === 'kiko') {
    return (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
          {/* Ground shadow beneath feet */}
          <ellipse cx="110" cy="226" rx="64" ry="11" fill="#0F172A" opacity="0.22" />
          {/* Cartoon stick legs */}
          <line x1="90" y1="165" x2="86" y2="218" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="78" cy="218" rx="14" ry="7" fill="#0F172A" />
          <line x1="130" y1="165" x2="134" y2="218" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="142" cy="218" rx="14" ry="7" fill="#0F172A" />
          {/* Kiko 6-Point Rounded Star Body */}
          <path
            d="M 110 32
               C 118 32 128 62 138 68
               C 148 76 178 74 184 84
               C 188 94 172 120 173 132
               C 174 145 194 168 188 178
               C 182 188 154 180 144 188
               C 134 196 128 220 110 220
               C 92 220 86 196 76 188
               C 66 180 38 188 32 178
               C 26 168 46 145 47 132
               C 48 120 32 94 36 84
               C 42 74 72 76 82 68
               C 92 62 102 32 110 32 Z"
            fill="#4F46E5"
          />
          {/* Light indigo highlight on top lobe */}
          <ellipse cx="92" cy="74" rx="18" ry="9" fill="#818CF8" opacity="0.8" transform="rotate(-20 92 74)" />
          {/* Signature Golden Yellow-Orange Blushes (Exact match to reference image!) */}
          <ellipse cx="74" cy="132" rx="11" ry="7" fill="#FBBF24" opacity="0.95" />
          <ellipse cx="146" cy="132" rx="11" ry="7" fill="#FBBF24" opacity="0.95" />
          {/* Playful anime eyes */}
          <ellipse cx="90" cy="120" rx="7.5" ry="10" fill="#0F172A" />
          <circle cx="88" cy="116" r="3.2" fill="#FFFFFF" />
          <ellipse cx="130" cy="120" rx="7.5" ry="10" fill="#0F172A" />
          <circle cx="128" cy="116" r="3.2" fill="#FFFFFF" />
          {/* Cute sweet smile */}
          <path d="M 104 135 Q 110 142 116 135" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Left Waving Arm */}
          <motion.g
            animate={{ rotate: [0, 10, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '48px 125px' }}
          >
            <path d="M 48 125 Q 24 105 14 78" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="14" cy="78" r="6" fill="#0F172A" />
          </motion.g>
          {/* Right Arm holding phone */}
          <path d="M 172 130 Q 186 136 192 125" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* White Smartphone */}
          <rect x="186" y="74" width="46" height="78" rx="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
          <rect x="190" y="80" width="38" height="62" rx="6" fill="#FFFBEB" />
          <circle cx="209" cy="111" r="13" fill="#F43F5E" />
          <path d="M 204 110 C 204 106 209 104 209 107 C 209 104 214 106 214 110 C 214 114 209 118 209 118 Z" fill="#FFFFFF" />
          {/* 3 vibration marks */}
          <line x1="208" y1="62" x2="216" y2="48" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="218" y1="64" x2="228" y2="50" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="226" y1="70" x2="236" y2="58" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Milo Default (Sunny Yellow Mascot matching user's reference mockup)
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
        {/* Ground shadow beneath feet */}
        <ellipse cx="110" cy="226" rx="68" ry="11" fill="#0F172A" opacity="0.22" />
        {/* Left Leg & Shoe */}
        <line x1="88" y1="172" x2="82" y2="218" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="76" cy="218" rx="14" ry="7" fill="#0F172A" />
        {/* Right Leg & Shoe */}
        <line x1="132" y1="172" x2="138" y2="218" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="144" cy="218" rx="14" ry="7" fill="#0F172A" />
        {/* Yellow Sphere Body */}
        <circle cx="110" cy="116" r="74" fill="#FBBF24" />
        <ellipse cx="85" cy="74" rx="22" ry="11" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 85 74)" />
        {/* Cute Arched Eyebrows */}
        <path d="M 72 88 Q 84 80 96 88" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 124 88 Q 136 80 148 88" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Eyes with white highlights */}
        <ellipse cx="84" cy="106" rx="9" ry="13" fill="#0F172A" />
        <circle cx="81" cy="101" r="4.2" fill="#FFFFFF" />
        <ellipse cx="136" cy="106" rx="9" ry="13" fill="#0F172A" />
        <circle cx="133" cy="101" r="4.2" fill="#FFFFFF" />
        {/* Rosy Cheeks */}
        <circle cx="66" cy="124" r="14" fill="#F43F5E" opacity="0.8" />
        <circle cx="154" cy="124" r="14" fill="#F43F5E" opacity="0.8" />
        {/* Happy Open Smile with Pink Tongue */}
        <path d="M 92 128 Q 110 156 128 128 Z" fill="#991B1B" />
        <path d="M 96 128 Q 110 134 124 128" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M 101 144 Q 110 138 119 144 Q 110 154 101 144 Z" fill="#F472B6" />
        {/* Animated Left Waving Arm */}
        <motion.g
          animate={{ rotate: [0, 8, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '44px 118px' }}
        >
          <path d="M 44 118 Q 20 95 12 65" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="65" r="7" fill="#0F172A" />
        </motion.g>
        {/* Right Arm holding phone */}
        <path d="M 176 122 Q 194 130 200 120" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* White Smartphone with dark outline */}
        <rect x="188" y="74" width="46" height="78" rx="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
        <rect x="192" y="80" width="38" height="62" rx="6" fill="#FFFBEB" />
        {/* Pink Heart on screen */}
        <circle cx="211" cy="111" r="13" fill="#F43F5E" />
        <path d="M 206 110 C 206 106 211 104 211 107 C 211 104 216 106 216 110 C 216 114 211 118 211 118 Z" fill="#FFFFFF" />
        {/* Exactly 3 Vibration Marks above smartphone (///) */}
        <line x1="210" y1="62" x2="218" y2="48" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="220" y1="64" x2="230" y2="50" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="228" y1="70" x2="238" y2="58" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function CompletionPage() {
  const { language } = useLanguage();
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

  const isIndo = language === 'id';
  const userAvatarId = (state.participant.avatarId || 'milo').toLowerCase();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const [reflection] = useState(() => {
    try {
      const raw = localStorage.getItem('connection_quest_reflection_v1');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [certId] = useState(() => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `AFL-WP26-${num}`;
  });

  const [todayDate] = useState(() => {
    return new Date().toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  const endingData = ENDINGS_DATA[state.ending] || ENDINGS_DATA.curious_explorer;
  const participantName = state.participant.name || 'Participant';
  const participantHomegroup = state.participant.homegroup || 'AFL Homegroup';
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    sound.playSparkle(state.soundEnabled);

    // Automatically submit quest results to PostgreSQL Realtime Leaderboard
    if (state.participant.name) {
      const scoreData = calculateTotalScore({
        indicators: state.indicators,
        choices: state.choices,
        reflection,
        arcadeScore: 285,
      });

      submitParticipantQuest({
        participant: state.participant,
        ending: endingData,
        scoreData,
        reflection,
        indicators: state.indicators,
        choices: state.choices,
      }).then((res) => {
        setSubmissionStatus({
          isLive: res?.isLive,
          success: res?.success,
          totalScore: scoreData.totalScore,
        });
      });
    }
  }, [state.participant, state.indicators, state.choices, state.soundEnabled, reflection, endingData]);

  // Story Caption for Instagram CTA
  const storyCaption = isIndo
    ? `Saya ${participantName} (${participantHomegroup}) telah menyelesaikan Connection Quest di AFL Winter Peak 2026! 🚀\n\n🏆 Profil Koneksi: ${endingData.titleId}\n🎯 Komitmen 48 Jam: "${reflection?.nextAction || 'Membangun koneksi autentik dan bermakna'}"\n\nTag @ewaapeyek & @afl_official\n#AFLWinterPeak2026 #CapacityBuilding1 #ConnectionQuest`
    : `I am ${participantName} (${participantHomegroup}) and here is my 48-hour concrete pledge from AFL Winter Peak 2026! 🚀\n\n🏆 Connection Profile: ${endingData.titleEn}\n🎯 48-Hour Pledge: "${reflection?.nextAction || 'Building authentic and meaningful connections'}"\n\nTag @ewaapeyek & @afl_official\n#AFLWinterPeak2026 #CapacityBuilding1 #ConnectionQuest`;

  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  // Cross-browser download trigger that safely attaches to DOM
  const triggerBrowserDownload = (blobOrDataUrl, fileName) => {
    let url = blobOrDataUrl;
    let isBlob = false;
    if (blobOrDataUrl instanceof Blob) {
      url = URL.createObjectURL(blobOrDataUrl);
      isBlob = true;
    }
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        if (isBlob) {
          URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    }, 1500);
  };

  // Generate and Download 9:16 HD PNG matching user's selected avatar
  const handleDownloadPNG = async () => {
    sound.playSelect(state.soundEnabled);
    setIsGenerating(true);

    try {
      const canvas = await generateStoryCanvas({
        participant: { ...state.participant, avatarId: userAvatarId },
        endingData,
        reflection,
        certId,
        todayDate,
        isIndo,
      });

      if (!canvas) {
        setIsGenerating(false);
        return;
      }

      const safeName = (participantName || 'Peserta').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeHg = (participantHomegroup || 'AFL').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Story-Connection-Map-${safeName}-${safeHg}.png`;

      // 1. Try toBlob (preferred for large 1080x1920 HD images)
      let blob = null;
      try {
        blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      } catch (blobErr) {
        console.warn('toBlob error:', blobErr);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImageUrl(dataUrl);

      if (blob) {
        triggerBrowserDownload(blob, fileName);
      } else {
        triggerBrowserDownload(dataUrl, fileName);
      }
    } catch (err) {
      console.error('Error generating 9:16 canvas:', err);
      alert(
        isIndo
          ? 'Mohon maaf, terjadi kendala saat memproses gambar. Silakan coba lagi.'
          : 'Failed to process image. Please try again.'
      );
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };

  // Share to Instagram Story (Native share with image file or Download + Clipboard + Instagram Camera)
  const handleShareInstagram = async () => {
    sound.playPop(state.soundEnabled);
    setIsGenerating(true);

    try {
      const canvas = await generateStoryCanvas({
        participant: { ...state.participant, avatarId: userAvatarId },
        endingData,
        reflection,
        certId,
        todayDate,
        isIndo,
      });

      if (!canvas) {
        setIsGenerating(false);
        return;
      }

      const safeName = (participantName || 'Peserta').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeHg = (participantHomegroup || 'AFL').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Story-Connection-Map-${safeName}-${safeHg}.png`;

      let blob = null;
      try {
        blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      } catch (e) {
        console.warn('toBlob error:', e);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImageUrl(dataUrl);

      // Try converting canvas to Blob / File for direct native share sheet (Mobile)
      if (blob && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'AFL Winter Peak 2026 - Story Pledge',
              text: storyCaption,
            });
            setIsGenerating(false);
            return;
          } catch (shareErr) {
            if (shareErr?.name === 'AbortError') {
              setIsGenerating(false);
              return;
            }
          }
        }
      }

      // Fallback: Trigger download to file system
      if (blob) {
        triggerBrowserDownload(blob, fileName);
      } else {
        triggerBrowserDownload(dataUrl, fileName);
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(storyCaption);
        setCopiedCaption(true);
      }

      setShowInstagramModal(true);
    } catch (err) {
      console.error('Error sharing to Instagram:', err);
      alert(
        isIndo
          ? 'Gagal memproses gambar: ' + (err.message || err)
          : 'Failed to process image: ' + (err.message || err)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(storyCaption);
      setCopiedCaption(true);
      sound.playSelect(state.soundEnabled);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  const handleOpenInstagramApp = () => {
    sound.playPop(state.soundEnabled);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'instagram://story-camera';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 1500);
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  const handleRestart = () => {
    sound.playPop(state.soundEnabled);
    resetGame();
    navigate('/');
  };

  const strengthsList = isIndo
    ? endingData.strengthsId || ['Active Listening', 'Empati', 'Penyambung Dialog', 'Reflektif']
    : endingData.strengthsEn || ['Active Listening', 'Empathy', 'Bridge Building', 'Reflective'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-3 space-y-4"
    >
      {/* Page Title & Header */}
      <div className="text-center space-y-1">
        <Badge variant="mint" icon={CheckCircle2}>
          {isIndo ? 'Misi Selesai • Dokumentasi CTA' : 'Mission Complete • CTA Documentation'}
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
          {isIndo ? 'Dokumentasi Resmi Selesai' : 'Official Documentation Ready'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {isIndo
            ? 'Kartu komitmen 9:16 HD bergaya 3D bertingkat siap diunduh & dibagikan ke Instagram Stories.'
            : 'Your 3D layered 9:16 HD story commitment card is ready to download & share to Instagram Stories.'}
        </p>
      </div>

      {/* Collectible 9:16 Story Card Preview (AFL Signature Yellow & Gold Gradient) */}
      <div id="printable-card" className="w-full">
        <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl border-2 border-amber-200/90 bg-gradient-to-b from-[#FFFDF2] via-[#FEF9E6] to-[#FEF08A] p-0 text-left">
          {/* Top Header: AFL / WINTER PEAK (Left) & CONNECTION QUEST (Right) */}
          <div className="pt-6 sm:pt-7 px-6 sm:px-8 flex justify-between items-start text-slate-900 relative z-10">
            <div>
              <span className="font-black text-2xl sm:text-3xl block leading-tight tracking-tight text-slate-900">AFL</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 block tracking-wider uppercase mt-0.5">
                WINTER PEAK 2026
              </span>
              <div className="w-12 h-1 bg-amber-500 rounded-full my-1.5" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 block tracking-wide uppercase">
                CAPACITY BUILDING 1
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 block tracking-wide uppercase">
                CONNECTION
              </span>
              <span className="font-black text-2xl sm:text-3xl block leading-tight tracking-tight text-slate-900 mt-0.5">
                QUEST
              </span>
              <span className="text-xs sm:text-sm italic font-medium text-slate-500 block mt-1">
                Every choice shapes your connection.
              </span>
            </div>
          </div>

          {/* Animated Scenic World Background (Matching Game's Connectopia Animated Atmosphere) */}
          <div className="relative flex justify-center items-center pt-4 pb-2 overflow-hidden min-h-[220px] select-none">
            {/* Glowing Sun with Pulsing Halo */}
            <div className="absolute top-2 left-8 w-16 h-16 rounded-full bg-amber-300/80 blur-xs shadow-lg shadow-amber-300/50 pointer-events-none">
              <div className="absolute -inset-2 rounded-full bg-amber-200/50 animate-pulse" />
            </div>

            {/* Distant soft sun spot to the right (as in reference mockup) */}
            <div className="absolute top-7 right-8 w-8 h-8 rounded-full bg-amber-300/55 pointer-events-none" />

            {/* Drifting Clouds Layer 1 (Slow) */}
            <div className="absolute top-3 left-0 w-36 h-10 opacity-75 animate-cloud-slow pointer-events-none">
              <svg viewBox="0 0 100 35" fill="#FFFFFF" className="w-full h-full drop-shadow-xs">
                <path d="M 10 25 C 10 18 16 12 25 14 C 28 8 36 6 45 10 C 52 4 64 6 70 12 C 78 10 88 16 88 25 Z" />
              </svg>
            </div>

            {/* Drifting Clouds Layer 2 (Faster) */}
            <div className="absolute top-10 left-0 w-24 h-8 opacity-65 animate-cloud-fast pointer-events-none">
              <svg viewBox="0 0 100 35" fill="#FFFFFF" className="w-full h-full drop-shadow-xs">
                <path d="M 10 25 C 10 18 16 12 25 14 C 28 8 36 6 45 10 C 52 4 64 6 70 12 C 78 10 88 16 88 25 Z" />
              </svg>
            </div>

            {/* Floating Hot Air Balloon in background (Connectopia Chapter 1 signature) */}
            <div className="absolute top-6 right-20 w-8 h-11 animate-float-balloon opacity-80 pointer-events-none">
              <svg viewBox="0 0 40 55" fill="none" className="w-full h-full drop-shadow-xs">
                <path d="M 20 2 C 7 2 2 16 8 28 C 12 36 16 40 20 40 C 24 40 28 36 32 28 C 38 16 33 2 20 2 Z" fill="#FB923C" />
                <path d="M 20 2 C 14 2 12 18 16 32 C 18 38 19 40 20 40 C 21 40 22 38 24 32 C 28 18 26 2 20 2 Z" fill="#FBBF24" />
                <line x1="16" y1="40" x2="17" y2="46" stroke="#78350F" strokeWidth="1" />
                <line x1="24" y1="40" x2="23" y2="46" stroke="#78350F" strokeWidth="1" />
                <rect x="16" y="46" width="8" height="6" rx="1.5" fill="#B45309" />
              </svg>
            </div>

            {/* Circular golden sun dome rising behind mascot */}
            <div className="absolute w-56 h-56 rounded-full bg-amber-300/50 pointer-events-none" />

            {/* Distant Rolling Hills with Spinning Fantasy Windmill */}
            <div className="absolute bottom-0 inset-x-0 h-20 opacity-80 pointer-events-none">
              <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M 0 50 Q 150 15 300 45 Q 450 10 600 40 L 600 100 L 0 100 Z" fill="#FEF08A" opacity="0.6" />
                <path d="M 0 65 Q 120 35 240 60 Q 400 30 600 55 L 600 100 L 0 100 Z" fill="#FDE68A" opacity="0.8" />
              </svg>

              {/* Little Fantasy Windmill on the left hill */}
              <div className="absolute top-2 left-8 w-6 h-9">
                <svg viewBox="0 0 30 50" fill="none" className="w-full h-full">
                  <polygon points="10,50 20,50 18,22 12,22" fill="#FEF9C3" stroke="#CBD5E1" strokeWidth="1" />
                  <polygon points="11,22 19,22 15,14" fill="#F87171" />
                  <g className="animate-windmill" style={{ transformOrigin: '15px 22px' }}>
                    <line x1="15" y1="22" x2="15" y2="6" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="15" y1="22" x2="15" y2="38" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="15" y1="22" x2="1" y2="22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="15" y1="22" x2="29" y2="22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="15" cy="22" r="2" fill="#F59E0B" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Foreground Rolling Hill where Mascot Stands */}
            <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none">
              <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="w-full h-full">
                <path d="M 0 35 Q 200 10 400 25 Q 520 15 600 30 L 600 60 L 0 60 Z" fill="#FEF08A" />
              </svg>
            </div>

            {/* Hero Mascot on Ground */}
            <div className="relative z-10 pt-2">
              <PreviewHeroMascot avatarId={userAvatarId} />
            </div>
          </div>

          {/* Full-Width Spacious Card Rows (matching user's reference mockup) */}
          <div className="px-4 sm:px-6 pb-6 space-y-3.5 sm:space-y-4 relative z-10">
            {/* Card 1: Participant Identity */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-100/60 flex items-center gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0 bg-gradient-to-br from-violet-300 to-indigo-400 flex items-center justify-center shadow-xs">
                <PersonCardIcon />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-500 block uppercase tracking-wide">
                  PESERTA • HOMEGROUP {String(participantHomegroup).replace(/^homegroup\s*/i, '')}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
                  {participantName}
                </h4>
                <p className="text-sm sm:text-base font-extrabold text-violet-600 leading-tight truncate">
                  {endingData.titleId || endingData.titleEn}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium italic truncate">
                  “{endingData.subtitleId || endingData.subtitleEn}”
                </p>
              </div>
              <span className="text-slate-300 text-3xl sm:text-4xl font-light shrink-0 select-none">›</span>
            </div>

            {/* Card 2: 48-Hour Pledge */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-100/60 flex items-start gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0 bg-gradient-to-br from-rose-200 to-rose-400 flex items-center justify-center shadow-xs mt-0.5">
                <TargetCardIcon />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <span className="text-xs sm:text-sm font-black text-rose-600 block uppercase tracking-wide">
                  {isIndo ? 'KOMITMEN TINDAKAN 48 JAM' : '48-HOUR ACTION PLEDGE'}
                </span>
                <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  “{reflection?.nextAction || (isIndo ? 'Mulai obrolan baru' : 'Start a new conversation')}”
                </p>
                <div className="flex items-center gap-4 pt-1.5 text-slate-800">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-500 block">Target</span>
                    <div className="flex items-center gap-1 font-bold text-slate-900 truncate text-xs sm:text-sm mt-0.5">
                      <span>📍</span>
                      <span className="truncate">{reflection?.targetEnvironment || 'Organisasi Kampus'}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-500 block">Strategi</span>
                    <div className="flex items-center gap-1 font-bold text-slate-900 truncate text-xs sm:text-sm mt-0.5">
                      <span>💡</span>
                      <span className="truncate">{reflection?.strategyToPractice || 'Active listening'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-slate-300 text-3xl sm:text-4xl font-light shrink-0 mt-1 select-none">›</span>
            </div>

            {/* Card 3: Signature Strengths */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-100/60 flex items-start gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0 bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center shadow-xs mt-0.5">
                <StarCardIcon />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-black text-emerald-600 block uppercase tracking-wide mb-2.5">
                  {isIndo ? 'KEKUATAN KARAKTER UTAMA' : 'SIGNATURE STRENGTHS'}
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm font-bold text-slate-900">
                  {strengthsList.slice(0, 4).map((str, idx) => (
                    <div key={idx} className="flex items-center gap-2 truncate">
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 font-bold">
                        ✓
                      </span>
                      <span className="truncate">{str}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-slate-300 text-3xl sm:text-4xl font-light shrink-0 mt-1 select-none">›</span>
            </div>

            {/* Card 4: Tag Instagram @ewaapeyek (Clean Centered Pill) */}
            <div className="bg-[#EEF2FF] border border-indigo-100/80 rounded-2xl sm:rounded-3xl py-4 sm:py-5 px-6 shadow-xs text-center">
              <p className="text-sm sm:text-base font-bold text-slate-600">
                Tag Instagram <span className="font-black text-slate-900">@ewaapeyek</span>
              </p>
            </div>
          </div>

          {/* Bottom Scenic Dunes Finish */}
          <div className="w-full h-8 sm:h-10 opacity-70 pointer-events-none -mt-2">
            <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="w-full h-full">
              <path d="M 0 20 Q 200 40 400 15 Q 520 30 600 20 L 600 40 L 0 40 Z" fill="#FDE047" opacity="0.6" />
              <path d="M 0 28 Q 150 15 320 28 Q 480 18 600 25 L 600 40 L 0 40 Z" fill="#FCD34D" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Download & Action Buttons */}
      <div className="space-y-2 pt-2">
        {/* Quick Access: Share to Instagram Stories */}
        <Button
          variant="primary"
          onClick={handleShareInstagram}
          disabled={isGenerating}
          icon={InstagramIcon}
          className="w-full py-4 text-sm sm:text-base font-extrabold shadow-bouncy bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:via-pink-600 hover:to-amber-600 text-white border-0"
        >
          {isGenerating
            ? isIndo
              ? 'Sedang Memproses Gambar 9:16 HD...'
              : 'Generating 9:16 HD Story...'
            : isIndo
            ? 'Bagikan ke Instagram Story'
            : 'Share to Instagram Story'}
        </Button>

        {/* Secondary Download Button */}
        <Button
          variant="secondary"
          onClick={handleDownloadPNG}
          disabled={isGenerating}
          icon={Download}
          className="w-full text-xs sm:text-sm py-3.5 font-bold"
        >
          {isIndo ? 'Unduh Gambar 9:16 HD' : 'Download 9:16 HD PNG'}
        </Button>

        {/* Real-Time Database Sync Status */}
        {submissionStatus && (
          <div
            className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
              submissionStatus.isLive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  submissionStatus.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>
                {submissionStatus.isLive
                  ? isIndo
                    ? 'Tersimpan di Leaderboard Live Real-Time'
                    : 'Saved to Live Real-Time Leaderboard'
                  : isIndo
                  ? 'Tersimpan di Leaderboard'
                  : 'Saved to Leaderboard'}
              </span>
            </div>
            <span className="font-extrabold text-amber-900">
              {submissionStatus.totalScore} pts
            </span>
          </div>
        )}

        {/* Real-time Leaderboard Link Button (Clean, No Emojis, No Arrows) */}
        <Button
          variant="outline"
          onClick={() => navigate('/leaderboard')}
          icon={Trophy}
          className="w-full text-xs sm:text-sm py-3.5 font-extrabold border-2 border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-950 shadow-xs"
        >
          {isIndo ? 'Lihat Peringkat Leaderboard Real-Time' : 'View Real-Time Leaderboard'}
        </Button>
      </div>

      {/* Start New Story / Reset Progress Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isIndo ? 'Mulai Cerita Baru (Reset Progres)' : 'Start New Story (Reset)'}</span>
        </button>
      </div>

      {/* Modal: Instagram Story Share Instructions & Caption Clipboard */}
      <AnimatePresence>
        {showInstagramModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-amber-200 relative text-left space-y-4"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowInstagramModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {isIndo ? 'Siap Unggah ke Instagram Story' : 'Ready for Instagram Story'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIndo ? 'Dokumentasi 9:16 HD & Caption CTA' : '9:16 HD Story Card & CTA Caption'}
                  </p>
                </div>
              </div>

              {/* Preview of Generated 9:16 HD Story Card */}
              {previewImageUrl && (
                <div className="flex items-center gap-3 bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200">
                  <img
                    src={previewImageUrl}
                    alt="Story Preview"
                    className="w-14 h-24 object-cover rounded-xl shadow-xs border border-amber-300"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-amber-950">
                      {isIndo ? 'Kartu 9:16 HD Siap' : '9:16 HD Card Ready'}
                    </p>
                    <p className="text-[11px] text-amber-800 leading-tight">
                      {isIndo
                        ? 'Jika unduhan tidak otomatis dimulai di browser HP Anda, tekan & tahan gambar untuk menyimpan.'
                        : 'If download did not start automatically, long press the image to save.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {isIndo ? 'Kartu 9:16 HD Berhasil Diproses' : '9:16 HD Story Card Processed'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {isIndo
                    ? 'Buka Instagram Story, pilih file gambar yang baru saja diunduh, lalu tempelkan caption komitmenmu!'
                    : 'Open Instagram Stories, select your downloaded card, and paste your pledge caption!'}
                </p>
              </div>

              {/* Caption Box with One-Click Copy */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">
                    {isIndo ? 'Caption & Tagar Instagram:' : 'Instagram Caption & Tags:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md cursor-pointer transition"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isIndo ? 'Tersalin' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isIndo ? 'Salin Caption' : 'Copy Caption'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {storyCaption}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="primary"
                  onClick={handleOpenInstagramApp}
                  icon={ExternalLink}
                  className="w-full py-3 text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 text-white border-0 shadow-md"
                >
                  {isIndo ? 'Buka Instagram' : 'Open Instagram'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowInstagramModal(false)}
                  className="w-full text-xs py-2.5 font-bold"
                >
                  {isIndo ? 'Selesai' : 'Done'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Reset */}
      <ConfirmResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleRestart}
      />
    </motion.div>
  );
}
