import React from 'react';

// Chapter 1: Animated Town Square (Connectopia Plaza)
function TownSquareFantasyWorld() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-amber-100 to-amber-50/70" />

      {/* Sun with glowing ring */}
      <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-amber-300/80 blur-xs shadow-lg shadow-amber-300/50">
        <div className="absolute -inset-2 rounded-full bg-amber-200/40 animate-pulse" />
      </div>

      {/* Drifting Clouds Layer 1 (Slow) */}
      <div className="absolute top-6 left-0 w-32 h-10 opacity-75 animate-cloud-slow">
        <svg viewBox="0 0 100 35" fill="#FFFFFF" className="w-full h-full drop-shadow-xs">
          <path d="M 10 25 C 10 18 16 12 25 14 C 28 8 36 6 45 10 C 52 4 64 6 70 12 C 78 10 88 16 88 25 Z" />
        </svg>
      </div>

      {/* Drifting Clouds Layer 2 (Faster) */}
      <div className="absolute top-14 left-0 w-24 h-8 opacity-60 animate-cloud-fast">
        <svg viewBox="0 0 100 35" fill="#FFFFFF" className="w-full h-full drop-shadow-xs">
          <path d="M 10 25 C 10 18 16 12 25 14 C 28 8 36 6 45 10 C 52 4 64 6 70 12 C 78 10 88 16 88 25 Z" />
        </svg>
      </div>

      {/* Floating Hot Air Balloon in background */}
      <div className="absolute top-8 right-12 w-9 h-13 animate-float-balloon opacity-85">
        <svg viewBox="0 0 40 55" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Balloon Body */}
          <path d="M 20 2 C 7 2 2 16 8 28 C 12 36 16 40 20 40 C 24 40 28 36 32 28 C 38 16 33 2 20 2 Z" fill="#FB923C" />
          <path d="M 20 2 C 14 2 12 18 16 32 C 18 38 19 40 20 40 C 21 40 22 38 24 32 C 28 18 26 2 20 2 Z" fill="#FBBF24" />
          {/* Basket ropes & basket */}
          <line x1="16" y1="40" x2="17" y2="46" stroke="#78350F" strokeWidth="1" />
          <line x1="24" y1="40" x2="23" y2="46" stroke="#78350F" strokeWidth="1" />
          <rect x="16" y="46" width="8" height="6" rx="1.5" fill="#B45309" />
        </svg>
      </div>

      {/* Distant Rolling Hills & Spinning Windmill */}
      <div className="absolute bottom-16 inset-x-0 h-28 opacity-90">
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full">
          {/* Far hills */}
          <path d="M 0 60 Q 150 20 300 55 Q 450 15 600 50 L 600 120 L 0 120 Z" fill="#BBF7D0" opacity="0.6" />
          {/* Mid hills */}
          <path d="M 0 75 Q 120 45 240 70 Q 400 40 600 65 L 600 120 L 0 120 Z" fill="#86EFAC" opacity="0.75" />
        </svg>

        {/* Little Fantasy Windmill on the left hill */}
        <div className="absolute top-4 left-10 w-7 h-11">
          <svg viewBox="0 0 30 50" fill="none" className="w-full h-full">
            {/* Tower */}
            <polygon points="10,50 20,50 18,22 12,22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <polygon points="11,22 19,22 15,14" fill="#EF4444" />
            {/* Rotating Blades */}
            <g className="animate-windmill" style={{ transformOrigin: '15px 22px' }}>
              <line x1="15" y1="22" x2="15" y2="6" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="22" x2="15" y2="38" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="22" x2="1" y2="22" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="22" x2="29" y2="22" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="15" cy="22" r="2" fill="#F59E0B" />
            </g>
          </svg>
        </div>
      </div>

      {/* Town Square Fairytale Roofs on Left & Right */}
      {/* Left Cottage */}
      <div className="absolute bottom-12 -left-3 w-28 h-36">
        <svg viewBox="0 0 100 140" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Walls */}
          <rect x="15" y="60" width="70" height="80" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
          {/* Roof */}
          <polygon points="50,15 95,65 5,65" fill="#F87171" stroke="#DC2626" strokeWidth="2" />
          {/* Round attic window */}
          <circle cx="50" cy="45" r="9" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="50" y1="36" x2="50" y2="54" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="41" y1="45" x2="59" y2="45" stroke="#DC2626" strokeWidth="1.5" />
          {/* Door */}
          <rect x="40" y="95" width="22" height="45" rx="6" fill="#78350F" />
          <circle cx="58" cy="115" r="2" fill="#FDE047" />
        </svg>
      </div>

      {/* Right Festival Tent */}
      <div className="absolute bottom-12 -right-3 w-28 h-36">
        <svg viewBox="0 0 100 140" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Striped Tent Canopy */}
          <polygon points="50,20 95,75 5,75" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" />
          <polygon points="50,20 72,75 28,75" fill="#FFFFFF" opacity="0.9" />
          {/* Tent poles */}
          <rect x="15" y="75" width="70" height="65" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" />
          {/* Counter display */}
          <rect x="25" y="90" width="50" height="25" rx="4" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Swaying Festival Bunting Garlands in Foreground */}
      <div className="absolute top-0 inset-x-0 h-14 animate-sway">
        <svg viewBox="0 0 400 45" preserveAspectRatio="none" className="w-full h-full">
          <path d="M 0 5 Q 100 35 200 12 Q 300 35 400 5" stroke="#B45309" strokeWidth="2" fill="none" />
          <polygon points="40,16 55,36 25,36" fill="#EF4444" />
          <polygon points="100,24 115,44 85,44" fill="#F59E0B" />
          <polygon points="160,18 175,38 145,38" fill="#10B981" />
          <polygon points="240,18 255,38 225,38" fill="#3B82F6" />
          <polygon points="300,24 315,44 285,44" fill="#EC4899" />
          <polygon points="360,16 375,36 345,36" fill="#8B5CF6" />
        </svg>
      </div>

      {/* Cobblestone Town Ground */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-amber-200/90 to-amber-100/50 border-t-2 border-amber-300">
        <svg className="w-full h-full opacity-35" viewBox="0 0 300 50" preserveAspectRatio="none">
          <ellipse cx="40" cy="18" rx="14" ry="7" fill="#B45309" />
          <ellipse cx="85" cy="30" rx="16" ry="8" fill="#B45309" />
          <ellipse cx="140" cy="16" rx="15" ry="7" fill="#B45309" />
          <ellipse cx="195" cy="32" rx="17" ry="8" fill="#B45309" />
          <ellipse cx="250" cy="18" rx="14" ry="7" fill="#B45309" />
        </svg>
      </div>
    </div>
  );
}

// Chapter 2: Animated Quiet Garden (Enchanted Fairytale Grove)
function QuietGardenFantasyWorld() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Twilight magical sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-800 via-emerald-600/70 to-teal-50" />

      {/* Gentle Crescent Moon */}
      <div className="absolute top-4 right-10 w-12 h-12">
        <svg viewBox="0 0 50 50" fill="none" className="w-full h-full drop-shadow-md">
          <path
            d="M 35 10 C 22 10 12 20 12 32 C 12 38 14 43 18 47 C 12 44 8 38 8 30 C 8 18 18 8 30 8 C 32 8 34 8 35 10 Z"
            fill="#FEF08A"
          />
        </svg>
      </div>

      {/* Twinkling stars */}
      <div className="absolute top-6 left-12 w-2 h-2 rounded-full bg-white opacity-80 animate-ping" />
      <div className="absolute top-10 left-36 w-1.5 h-1.5 rounded-full bg-teal-100 opacity-90" />
      <div className="absolute top-16 right-32 w-2 h-2 rounded-full bg-amber-200 opacity-80" />

      {/* Swaying Willow Branches on Top */}
      <div className="absolute top-0 inset-x-0 h-28 animate-sway-slow">
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full opacity-80">
          <path d="M 0 0 C 40 40 60 70 70 100" stroke="#065F46" strokeWidth="4" fill="none" />
          <path d="M 50 0 C 90 35 110 65 115 90" stroke="#047857" strokeWidth="3.5" fill="none" />
          <path d="M 120 0 C 140 30 150 60 155 85" stroke="#059669" strokeWidth="3" fill="none" />

          <path d="M 500 0 C 460 40 440 70 430 100" stroke="#065F46" strokeWidth="4" fill="none" />
          <path d="M 450 0 C 410 35 390 65 385 90" stroke="#047857" strokeWidth="3.5" fill="none" />
          <path d="M 380 0 C 360 30 350 60 345 85" stroke="#059669" strokeWidth="3" fill="none" />

          {/* Leaves on vines */}
          <circle cx="70" cy="98" r="4" fill="#34D399" />
          <circle cx="115" cy="88" r="3.5" fill="#6EE7B7" />
          <circle cx="430" cy="98" r="4" fill="#34D399" />
          <circle cx="385" cy="88" r="3.5" fill="#6EE7B7" />
        </svg>
      </div>

      {/* Falling gentle glowing petals/leaves */}
      <div className="absolute top-10 left-16 w-3 h-3 rounded-full bg-emerald-200/80 animate-falling-leaf-1" />
      <div className="absolute top-4 right-24 w-3.5 h-3.5 rounded-full bg-teal-200/80 animate-falling-leaf-2" />
      <div className="absolute top-8 left-1/2 w-2.5 h-2.5 rounded-full bg-amber-200/70 animate-falling-leaf-3" />

      {/* Floating Glowing Fireflies */}
      <div className="absolute top-1/3 left-14 w-3 h-3 rounded-full bg-amber-300 shadow-md shadow-amber-300/80 animate-firefly-1" />
      <div className="absolute top-1/2 right-16 w-3.5 h-3.5 rounded-full bg-emerald-300 shadow-md shadow-emerald-300/80 animate-firefly-2" />
      <div className="absolute top-2/5 left-1/3 w-2.5 h-2.5 rounded-full bg-yellow-200 shadow-md shadow-yellow-200/80 animate-firefly-3" />

      {/* Enchanted Pond in Background with ripples */}
      <div className="absolute bottom-10 inset-x-12 h-14 opacity-75">
        <svg viewBox="0 0 300 50" preserveAspectRatio="none" className="w-full h-full">
          <ellipse cx="150" cy="25" rx="130" ry="20" fill="#0D9488" opacity="0.5" />
          <ellipse cx="150" cy="25" rx="90" ry="12" fill="#14B8A6" opacity="0.6" />
          {/* Water lily */}
          <circle cx="110" cy="24" r="5" fill="#F472B6" />
          <ellipse cx="110" cy="26" rx="8" ry="4" fill="#059669" />
          <circle cx="190" cy="22" r="4" fill="#F472B6" />
          <ellipse cx="190" cy="24" rx="7" ry="3.5" fill="#059669" />
        </svg>
      </div>

      {/* Soft Mossy Ground */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-teal-900/90 via-emerald-800/80 to-emerald-700/40 border-t border-teal-500/40">
        <svg className="w-full h-full opacity-40" viewBox="0 0 300 50" preserveAspectRatio="none">
          <circle cx="30" cy="40" r="10" fill="#34D399" />
          <circle cx="75" cy="35" r="8" fill="#6EE7B7" />
          <circle cx="160" cy="42" r="11" fill="#34D399" />
          <circle cx="230" cy="38" r="9" fill="#6EE7B7" />
          <circle cx="280" cy="40" r="10" fill="#34D399" />
        </svg>
      </div>
    </div>
  );
}

// Chapter 3: Animated Community Workshop (Cozy Craftsman Guild)
function WorkshopFantasyWorld() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Warm timber atmospheric gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-amber-900/60 to-amber-100/80" />

      {/* Cozy Chimney on Left Roof with Puffing Cartoon Smoke */}
      <div className="absolute top-2 left-6 w-12 h-20">
        {/* Brick Chimney */}
        <div className="absolute bottom-0 left-2 w-8 h-14 bg-amber-800 border-2 border-amber-950 rounded-t-sm" />
        {/* Puffing Smoke Rings */}
        <div className="absolute -top-3 left-3 w-5 h-5 rounded-full bg-white/70 animate-smoke-1" />
        <div className="absolute -top-6 left-2 w-7 h-7 rounded-full bg-white/60 animate-smoke-2" />
      </div>

      {/* Ceiling Timber Beams */}
      <div className="absolute top-0 inset-x-0 h-8 bg-amber-950 border-b-2 border-amber-800 shadow-md">
        {/* Rafter brackets */}
        <div className="flex justify-around items-center h-full px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-full bg-amber-900 border-x border-amber-950" />
          ))}
        </div>
      </div>

      {/* Hanging Workshop Fairy Lanterns Swaying */}
      <div className="absolute top-8 left-16 w-8 h-16 animate-sway flex flex-col items-center">
        <div className="w-0.5 h-4 bg-amber-800" />
        <div className="w-6 h-8 rounded-full bg-amber-300 border-2 border-amber-500 shadow-lg shadow-amber-300/80" />
      </div>

      <div className="absolute top-8 right-16 w-8 h-16 animate-sway-slow flex flex-col items-center">
        <div className="w-0.5 h-4 bg-amber-800" />
        <div className="w-6 h-8 rounded-full bg-amber-300 border-2 border-amber-500 shadow-lg shadow-amber-300/80" />
      </div>

      {/* Spinning Wooden Cogwheel / Gear on the Right Wall */}
      <div className="absolute top-14 right-6 w-12 h-12 opacity-85">
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full animate-windmill" style={{ animationDuration: '24s' }}>
          <circle cx="30" cy="30" r="20" fill="#78350F" stroke="#D97706" strokeWidth="3" />
          {/* Gear teeth */}
          <rect x="26" y="4" width="8" height="8" rx="2" fill="#B45309" />
          <rect x="26" y="48" width="8" height="8" rx="2" fill="#B45309" />
          <rect x="4" y="26" width="8" height="8" rx="2" fill="#B45309" />
          <rect x="48" y="26" width="8" height="8" rx="2" fill="#B45309" />
          <circle cx="30" cy="30" r="7" fill="#FDE68A" />
        </svg>
      </div>

      {/* Warm Glowing Workshop Window in Background */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-28 h-20 bg-amber-300/60 rounded-t-3xl border-3 border-amber-950 p-1 shadow-lg shadow-amber-300/40">
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
          <div className="bg-amber-100/70 rounded-tl-xl" />
          <div className="bg-amber-100/70 rounded-tr-xl" />
          <div className="bg-amber-100/70" />
          <div className="bg-amber-100/70" />
        </div>
      </div>

      {/* Floating Glowing Sparks / Woodcraft Dust Motes */}
      <div className="absolute top-1/2 left-20 w-2 h-2 rounded-full bg-amber-400 opacity-80 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-2/5 right-24 w-2 h-2 rounded-full bg-yellow-300 opacity-90 animate-ping" style={{ animationDuration: '4s' }} />

      {/* Workshop Wooden Plank Floor */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800 border-t-2 border-amber-700">
        {/* Wood planks grain lines */}
        <div className="flex justify-between items-center h-full px-2 opacity-50">
          <div className="w-1/4 h-full border-r border-amber-950" />
          <div className="w-1/4 h-full border-r border-amber-950" />
          <div className="w-1/4 h-full border-r border-amber-950" />
          <div className="w-1/4 h-full" />
        </div>
      </div>
    </div>
  );
}

export function FantasyAnimatedBackground({ chapter = 1 }) {
  switch (chapter) {
    case 2:
      return <QuietGardenFantasyWorld />;
    case 3:
      return <WorkshopFantasyWorld />;
    case 1:
    default:
      return <TownSquareFantasyWorld />;
  }
}
