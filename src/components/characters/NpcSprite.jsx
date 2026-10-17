import React from 'react';
import { motion } from 'motion/react';

// Piko Sprite - Town Square Coordinator (Energetic, friendly, bright coral & cream)
export function PikoSprite({ className = 'w-32 h-32', expression = 'neutral' }) {
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isImpressed = expression === 'impressed';

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        y: isHappy ? [0, -8, 0] : [0, -3, 0],
        rotate: isThinking ? [-2, 2, -2] : 0,
      }}
      transition={{ duration: isHappy ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="184" rx="46" ry="6" fill="#E2E8F0" opacity="0.7" />

      {/* Cute ears */}
      <motion.path
        d="M 68 70 C 50 30 75 15 88 50 Z"
        fill="#FB923C"
        animate={{ rotate: isHappy ? [-5, 5, -5] : 0 }}
        style={{ transformOrigin: '80px 60px' }}
      />
      <path d="M 72 62 C 60 40 75 30 84 52 Z" fill="#FED7AA" />

      <motion.path
        d="M 132 70 C 150 30 125 15 112 50 Z"
        fill="#FB923C"
        animate={{ rotate: isHappy ? [5, -5, 5] : 0 }}
        style={{ transformOrigin: '120px 60px' }}
      />
      <path d="M 128 62 C 140 40 125 30 116 52 Z" fill="#FED7AA" />

      {/* Main Body */}
      <circle cx="100" cy="115" r="58" fill="#F97316" />
      <circle cx="100" cy="122" r="42" fill="#FFEDD5" />

      {/* Feet */}
      <ellipse cx="80" cy="172" rx="14" ry="7" fill="#EA580C" />
      <ellipse cx="120" cy="172" rx="14" ry="7" fill="#EA580C" />

      {/* Coordinator Badge */}
      <path d="M 94 135 L 106 135 L 100 148 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      <circle cx="100" cy="133" r="5" fill="#FBBF24" />

      {/* Eyes based on expression */}
      {isHappy || isImpressed ? (
        <>
          <path d="M 74 105 Q 84 94 94 105" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 106 105 Q 116 94 126 105" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : isThinking ? (
        <>
          <circle cx="84" cy="104" r="6" fill="#1E293B" />
          <circle cx="82" cy="102" r="2" fill="#FFFFFF" />
          <circle cx="116" cy="101" r="6" fill="#1E293B" />
          <circle cx="114" cy="99" r="2" fill="#FFFFFF" />
          <path d="M 110 92 Q 118 88 124 92" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="84" cy="104" r="6.5" fill="#1E293B" />
          <circle cx="82" cy="101" r="2.5" fill="#FFFFFF" />
          <circle cx="116" cy="104" r="6.5" fill="#1E293B" />
          <circle cx="114" cy="101" r="2.5" fill="#FFFFFF" />
        </>
      )}

      {/* Blushes */}
      <ellipse cx="70" cy="118" rx="8" ry="5" fill="#F43F5E" opacity="0.65" />
      <ellipse cx="130" cy="118" rx="8" ry="5" fill="#F43F5E" opacity="0.65" />

      {/* Mouth */}
      {isHappy || isImpressed ? (
        <path d="M 88 116 Q 100 134 112 116 Z" fill="#881337" />
      ) : (
        <path d="M 94 118 Q 100 124 106 118" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
    </motion.svg>
  );
}

// Nori Sprite - Quiet Garden Resident (Gentle, introspective teal/sage hedgehog buddy)
export function NoriSprite({ className = 'w-32 h-32', expression = 'neutral' }) {
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        scaleY: [1, 1.03, 1],
        y: [0, -3, 0],
      }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="182" rx="44" ry="6" fill="#E2E8F0" opacity="0.7" />

      {/* Gentle Quill Spikes Behind */}
      <path
        d="M 50 120 C 35 90 60 70 80 85 C 80 55 110 50 120 75 C 135 60 165 75 155 110 C 170 130 155 160 135 155"
        fill="#0D9488"
        stroke="#0F766E"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Soft Tea Sprout on head */}
      <path d="M 100 68 Q 90 40 76 46 Q 88 56 100 68 Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
      <path d="M 100 68 Q 110 40 124 46 Q 112 56 100 68 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.5" />

      {/* Body */}
      <circle cx="100" cy="125" r="50" fill="#2DD4BF" />
      <ellipse cx="100" cy="132" rx="36" ry="34" fill="#CCFBF1" />

      {/* Feet */}
      <ellipse cx="80" cy="174" rx="12" ry="6" fill="#0F766E" />
      <ellipse cx="120" cy="174" rx="12" ry="6" fill="#0F766E" />

      {/* Cute Glasses */}
      <circle cx="82" cy="116" r="12" stroke="#0F766E" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="118" cy="116" r="12" stroke="#0F766E" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
      <line x1="94" y1="116" x2="106" y2="116" stroke="#0F766E" strokeWidth="2.5" />

      {/* Eyes inside glasses */}
      {isHappy ? (
        <>
          <path d="M 76 116 Q 82 110 88 116" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 112 116 Q 118 110 124 116" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="82" cy="116" r="5" fill="#1E293B" />
          <circle cx="80" cy="114" r="1.8" fill="#FFFFFF" />
          <circle cx="118" cy="116" r="5" fill="#1E293B" />
          <circle cx="116" cy="114" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {/* Gentle Blush */}
      <ellipse cx="68" cy="130" rx="8" ry="5" fill="#F472B6" opacity="0.6" />
      <ellipse cx="132" cy="130" rx="8" ry="5" fill="#F472B6" opacity="0.6" />

      {/* Gentle Smile */}
      <path
        d={isThinking ? "M 96 132 L 104 132" : "M 94 132 Q 100 137 106 132"}
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

// Bumi Sprite - Community Workshop Craftsman (Warm, grounded indigo bear buddy with maker scarf)
export function BumiSprite({ className = 'w-32 h-32', expression = 'neutral' }) {
  const isHappy = expression === 'happy';
  const isImpressed = expression === 'impressed';

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        y: [0, -4, 0],
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="186" rx="52" ry="7" fill="#E2E8F0" opacity="0.75" />

      {/* Bear Round Ears */}
      <circle cx="62" cy="72" r="18" fill="#4338CA" />
      <circle cx="62" cy="72" r="10" fill="#A5B4FC" />
      <circle cx="138" cy="72" r="18" fill="#4338CA" />
      <circle cx="138" cy="72" r="10" fill="#A5B4FC" />

      {/* Bear Body */}
      <circle cx="100" cy="118" r="62" fill="#6366F1" />
      <ellipse cx="100" cy="132" rx="42" ry="38" fill="#E0E7FF" />

      {/* Feet */}
      <ellipse cx="74" cy="176" rx="16" ry="8" fill="#3730A3" />
      <ellipse cx="126" cy="176" rx="16" ry="8" fill="#3730A3" />

      {/* Craftsman Bandana / Tool Apron detail */}
      <path d="M 72 128 Q 100 142 128 128 L 122 165 Q 100 172 78 165 Z" fill="#F59E0B" opacity="0.9" />
      {/* Little pencil in pocket */}
      <rect x="110" y="140" width="4" height="14" rx="2" fill="#EF4444" transform="rotate(15 110 140)" />

      {/* Bear Snout */}
      <ellipse cx="100" cy="118" rx="18" ry="14" fill="#C7D2FE" />
      <ellipse cx="100" cy="112" rx="7" ry="5" fill="#1E293B" />

      {/* Eyes */}
      {isHappy || isImpressed ? (
        <>
          <path d="M 76 98 Q 84 90 92 98" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 98 Q 116 90 124 98" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="84" cy="98" r="6" fill="#1E293B" />
          <circle cx="82" cy="95" r="2" fill="#FFFFFF" />
          <circle cx="116" cy="98" r="6" fill="#1E293B" />
          <circle cx="114" cy="95" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Warm Smile */}
      <path
        d="M 94 122 Q 100 128 106 122"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function NpcSprite({ npcId, className = 'w-32 h-32', expression = 'neutral' }) {
  switch (npcId) {
    case 'nori':
      return <NoriSprite className={className} expression={expression} />;
    case 'bumi':
      return <BumiSprite className={className} expression={expression} />;
    case 'piko':
    default:
      return <PikoSprite className={className} expression={expression} />;
  }
}
