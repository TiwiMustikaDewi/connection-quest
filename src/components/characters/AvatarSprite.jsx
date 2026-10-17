import React from 'react';
import { motion } from 'motion/react';

export function MiloSprite({ className = 'w-32 h-32', animated = true }) {
  const bounceAnimation = animated
    ? {
        animate: {
          y: [0, -6, 0],
          rotate: [0, 2, -2, 0],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...bounceAnimation}
    >
      {/* Drop shadow underneath */}
      <ellipse cx="100" cy="188" rx="46" ry="7" fill="#E2E8F0" opacity="0.7" />

      {/* Milo Stick Legs */}
      <line x1="82" y1="150" x2="78" y2="182" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="74" cy="182" rx="7" ry="4" fill="#1E293B" />

      <line x1="118" y1="150" x2="122" y2="182" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="126" cy="182" rx="7" ry="4" fill="#1E293B" />

      {/* Milo Body (Golden/Sunny Circle) */}
      <circle cx="100" cy="98" r="62" fill="#FBBF24" />
      {/* Highlight glow */}
      <ellipse cx="80" cy="65" rx="16" ry="8" fill="#FDE68A" transform="rotate(-25 80 65)" />

      {/* Left Arm waving up */}
      <motion.path
        d="M 42 100 Q 24 88 18 68"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        animate={animated ? { rotate: [0, 10, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '42px 100px' }}
      />
      {/* Left Hand fingers */}
      <circle cx="18" cy="68" r="3.5" fill="#1E293B" />
      <circle cx="14" cy="72" r="3" fill="#1E293B" />

      {/* Right Arm waving up */}
      <motion.path
        d="M 158 100 Q 176 88 182 68"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        animate={animated ? { rotate: [0, -10, 5, 0] } : {}}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        style={{ transformOrigin: '158px 100px' }}
      />
      {/* Right Hand fingers */}
      <circle cx="182" cy="68" r="3.5" fill="#1E293B" />
      <circle cx="186" cy="72" r="3" fill="#1E293B" />

      {/* Eyes & Eyeballs */}
      {/* Left Eye */}
      <ellipse cx="78" cy="90" rx="6.5" ry="8.5" fill="#1E293B" />
      <circle cx="76" cy="87" r="2.5" fill="#FFFFFF" />
      {/* Right Eye */}
      <ellipse cx="122" cy="90" rx="6.5" ry="8.5" fill="#1E293B" />
      <circle cx="120" cy="87" r="2.5" fill="#FFFFFF" />

      {/* Cheerful Eyebrows */}
      <path d="M 72 76 Q 78 72 84 76" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 116 76 Q 122 72 128 76" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Rosy Blush */}
      <ellipse cx="64" cy="102" rx="7" ry="5" fill="#F87171" opacity="0.65" />
      <ellipse cx="136" cy="102" rx="7" ry="5" fill="#F87171" opacity="0.65" />

      {/* Big Happy Smile with Tongue */}
      <path
        d="M 82 108 Q 100 132 118 108 Z"
        fill="#991B1B"
      />
      {/* Upper white teeth shine */}
      <path
        d="M 85 108 Q 100 114 115 108"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Pink tongue */}
      <path
        d="M 91 122 Q 100 116 109 122 Q 100 131 91 122 Z"
        fill="#F472B6"
      />
    </motion.svg>
  );
}

export function LumiSprite({ className = 'w-32 h-32', animated = true }) {
  const breatheAnimation = animated
    ? {
        animate: {
          scaleY: [1, 1.04, 1],
          scaleX: [1, 0.98, 1],
          y: [0, -4, 0],
        },
        transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...breatheAnimation}
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* Drop shadow */}
      <ellipse cx="100" cy="178" rx="48" ry="7" fill="#E2E8F0" opacity="0.75" />

      {/* Little mint feet/nubs */}
      <ellipse cx="78" cy="166" rx="14" ry="7" fill="#34D399" />
      <ellipse cx="122" cy="166" rx="14" ry="7" fill="#34D399" />

      {/* Lumi Droplet Blob Body */}
      <path
        d="M 52 142 C 40 102 58 64 100 64 C 142 64 160 102 148 142 C 144 158 130 166 100 166 C 70 166 56 158 52 142 Z"
        fill="#A7F3D0"
      />
      {/* Gentle mint highlight gradient */}
      <ellipse cx="82" cy="85" rx="18" ry="10" fill="#ECFDF5" transform="rotate(-20 82 85)" />

      {/* Soft Rosy Cheeks */}
      <ellipse cx="68" cy="130" rx="9" ry="6" fill="#FDA4AF" opacity="0.75" />
      <ellipse cx="132" cy="130" rx="9" ry="6" fill="#FDA4AF" opacity="0.75" />

      {/* Big Cute Sparkly Dark Eyes */}
      {/* Left Eye */}
      <circle cx="80" cy="116" r="9" fill="#1E293B" />
      <circle cx="77" cy="113" r="3.5" fill="#FFFFFF" />
      <circle cx="83" cy="118" r="1.5" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="120" cy="116" r="9" fill="#1E293B" />
      <circle cx="117" cy="113" r="3.5" fill="#FFFFFF" />
      <circle cx="123" cy="118" r="1.5" fill="#FFFFFF" />

      {/* Sweet Gentle Smile */}
      <path
        d="M 94 130 Q 100 136 106 130"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function KikoSprite({ className = 'w-32 h-32', animated = true }) {
  const swayAnimation = animated
    ? {
        animate: {
          rotate: [-2, 2, -2],
          y: [0, -5, 0],
        },
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...swayAnimation}
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="6" fill="#E2E8F0" opacity="0.7" />

      {/* White cartoon legs */}
      {/* Left leg */}
      <path d="M 82 128 L 80 178" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="76" cy="180" rx="10" ry="4" fill="#1E293B" />

      {/* Right leg */}
      <path d="M 118 128 L 120 178" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="124" cy="180" rx="10" ry="4" fill="#1E293B" />

      {/* Left white cartoon arm */}
      <path
        d="M 58 92 C 34 85 24 105 28 142"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* White cartoon hand */}
      <path
        d="M 28 142 C 22 144 20 152 26 156 C 30 158 35 154 36 148 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* Right white cartoon arm raised in wave */}
      <motion.path
        d="M 142 92 C 166 85 178 75 186 64"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        animate={animated ? { rotate: [0, 8, -6, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '142px 92px' }}
      />
      <circle cx="186" cy="64" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />

      {/* Kiko Star Body (Blue-Lilac rounded star) */}
      <path
        d="M 100 24
           C 107 24 116 48 124 53
           C 133 59 157 58 162 66
           C 166 74 153 95 154 105
           C 155 116 172 135 168 143
           C 163 151 140 144 132 150
           C 123 156 116 176 100 176
           C 84 176 77 156 68 150
           C 60 144 37 151 32 143
           C 28 135 45 116 46 105
           C 47 95 34 74 38 66
           C 43 58 67 59 76 53
           C 84 48 93 24 100 24 Z"
        fill="#4F46E5"
      />
      {/* Light lilac / indigo highlight */}
      <ellipse cx="85" cy="60" rx="14" ry="7" fill="#818CF8" transform="rotate(-20 85 60)" />

      {/* Golden Yellow / Peach Blushes */}
      <ellipse cx="72" cy="104" rx="7" ry="5" fill="#FBBF24" opacity="0.9" />
      <ellipse cx="128" cy="104" rx="7" ry="5" fill="#FBBF24" opacity="0.9" />

      {/* Playful Eyes */}
      {/* Left Eye */}
      <ellipse cx="86" cy="94" rx="5.5" ry="7" fill="#1E293B" />
      <circle cx="84" cy="91" r="2" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="114" cy="94" rx="5.5" ry="7" fill="#1E293B" />
      <circle cx="112" cy="91" r="2" fill="#FFFFFF" />

      {/* Cute Smiley Mouth */}
      <path
        d="M 94 108 Q 100 114 106 108"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function AvatarSprite({ avatarId, className = 'w-32 h-32', animated = true }) {
  switch (avatarId) {
    case 'lumi':
      return <LumiSprite className={className} animated={animated} />;
    case 'kiko':
      return <KikoSprite className={className} animated={animated} />;
    case 'milo':
    default:
      return <MiloSprite className={className} animated={animated} />;
  }
}
