// Connection Quest - Full Scenario & Decision Nodes with Interactive Mini-Actions
// AFL Winter Peak 2026

export const CHAPTERS_META = [
  {
    chapter: 1,
    titleId: 'Bab 1 — Awal yang Baru',
    titleEn: 'Chapter 1 — The New Beginning',
    locationId: 'Alun-Alun Kota',
    locationEn: 'Town Square',
    npcId: 'piko',
    npcName: 'Piko',
    bgTheme: 'from-amber-100 via-orange-50 to-amber-50',
    accentColor: 'amber',
  },
  {
    chapter: 2,
    titleId: 'Bab 2 — Beragam Cara Terhubung',
    titleEn: 'Chapter 2 — Different Ways to Connect',
    locationId: 'Taman Lentera Sunyi',
    locationEn: 'Quiet Garden',
    npcId: 'nori',
    npcName: 'Nori',
    bgTheme: 'from-teal-100 via-emerald-50 to-teal-50',
    accentColor: 'teal',
  },
  {
    chapter: 3,
    titleId: 'Bab 3 — Membangun Jembatan',
    titleEn: 'Chapter 3 — Building Bridges',
    locationId: 'Bengkel Komunitas',
    locationEn: 'Community Workshop',
    npcId: 'bumi',
    npcName: 'Bumi',
    bgTheme: 'from-indigo-100 via-violet-50 to-indigo-50',
    accentColor: 'indigo',
  },
];

export const STORY_SCENES = {
  // ==================== CHAPTER 1: TOWN SQUARE ====================
  'ch1_intro': {
    id: 'ch1_intro',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'wave',
    companionEmote: 'happy',
    textId: 'Hai! Wah, senang sekali melihatmu di Town Square! Aku Piko, koordinator festival. Sebelum kita mulai, ayo tos perkenalan dulu!',
    textEn: 'Hey there! Oh, so wonderful to see you in the Town Square! I am Piko. Before we dive in, let us do a welcoming high-five!',
    nextSceneId: 'ch1_mini_highfive',
  },

  // Interactive Mini-Action: High-Five Piko
  'ch1_mini_highfive': {
    id: 'ch1_mini_highfive',
    chapter: 1,
    isMiniGame: 'high_five',
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'excited',
    companionEmote: 'sparkle',
    textId: 'Piko mengangkat tangannya dengan penuh semangat. Sentuh telapak tangannya untuk tos!',
    textEn: 'Piko raises their hand with high spirits. Tap their palm for a high-five!',
    nextSceneId: 'ch1_d1',
  },

  // Decision 1
  'ch1_d1': {
    id: 'ch1_d1',
    chapter: 1,
    isDecision: true,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'neutral',
    npcEmote: 'lightbulb',
    companionEmote: 'thinking',
    textId: 'Piko sedang menata spanduk selamat datang yang cukup berat. Bagaimana caramu menyapanya?',
    textEn: 'Piko is holding a heavy welcome banner. How do you choose to introduce yourself?',
    choices: [
      {
        id: 'ch1_d1_c1',
        labelId: 'Sapukan senyum lebar: "Hai Piko! Aku di sini siap membantu. Biar aku pegang ujung spanduknya!"',
        labelEn: 'Smile warmly: "Hey Piko! Happy to help out. Let me grab the other side of that banner!"',
        impact: {
          indicators: { initiative: 2, authenticity: 1 },
          relationships: { pikoTrust: 2 },
        },
        reactionSceneId: 'ch1_d1_react_c1',
      },
      {
        id: 'ch1_d1_c2',
        labelId: 'Sapa dengan ramah: "Hai Piko! Sepertinya festival ini seru sekali. Boleh tahu tema utamanya?"',
        labelEn: 'Greet politely: "Hello Piko! The festival vibe feels so exciting. Could you share what the main theme is?"',
        impact: {
          indicators: { empathy: 2, adaptability: 1 },
          relationships: { pikoTrust: 1, festivalPlan: 1 },
        },
        reactionSceneId: 'ch1_d1_react_c2',
      },
      {
        id: 'ch1_d1_c3',
        labelId: 'Perhatikan sejenak, lalu beri salam santun: "Selamat siang Piko, aku peserta baru. Senang bisa berkenalan!"',
        labelEn: 'Observe the setting, then gently say: "Good afternoon Piko, I am a new arrival. Great to meet you!"',
        impact: {
          indicators: { adaptability: 2, authenticity: 1 },
          relationships: { pikoTrust: 1 },
        },
        reactionSceneId: 'ch1_d1_react_c3',
      },
    ],
  },
  'ch1_d1_react_c1': {
    id: 'ch1_d1_react_c1',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'sparkle',
    companionEmote: 'excited',
    textId: 'Wah, terima kasih atas inisiatifmu! Tanganku hampir kram tadi, haha. Enerjimu langsung membuat suasana jadi bersemangat!',
    textEn: 'Thank you for your initiative! My hands were cramping up, haha. Your energy makes everything brighter already!',
    nextSceneId: 'ch1_d2',
  },
  'ch1_d1_react_c2': {
    id: 'ch1_d1_react_c2',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'heart',
    companionEmote: 'happy',
    textId: 'Pertanyaan yang indah! Temanya adalah "Jembatan Persahabatan". Senang sekali ada yang peduli pada makna di balik festival ini.',
    textEn: 'What a lovely question! The theme is "Bridges of Friendship". It feels great when someone values the deeper purpose.',
    nextSceneId: 'ch1_d2',
  },
  'ch1_d1_react_c3': {
    id: 'ch1_d1_react_c3',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'happy',
    companionEmote: 'happy',
    textId: 'Selamat datang! Kesantunan dan ketenanganmu terasa sangat menyejukkan di tengah keriuhan festival ini.',
    textEn: 'Welcome! Your calm and respectful demeanor is so refreshing amidst all this hustle and bustle.',
    nextSceneId: 'ch1_d2',
  },

  // Decision 2
  'ch1_d2': {
    id: 'ch1_d2',
    chapter: 1,
    isDecision: true,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'thinking',
    npcEmote: 'thinking',
    companionEmote: 'thinking',
    textId: 'Di sudut alun-alun, ada lingkaran panitia yang sedang berdiskusi denah stan. Bagaimana caramu bergabung ke kelompok tersebut?',
    textEn: 'By the square corner, a committee circle is discussing booth plans. How do you choose to join them?',
    choices: [
      {
        id: 'ch1_d2_c1',
        labelId: 'Dekati kelompok, dengarkan topik mereka sejenak, lalu minta izin bergabung dengan santun.',
        labelEn: 'Approach quietly, listen to their flow for a moment, then politely ask to join in.',
        impact: {
          indicators: { adaptability: 2, empathy: 1 },
          relationships: { pikoTrust: 1 },
        },
        reactionSceneId: 'ch1_d2_react',
      },
      {
        id: 'ch1_d2_c2',
        labelId: 'Tanyakan kebutuhan mereka: "Kelihatannya seru dan sibuk, apa ada yang bisa kubantu?"',
        labelEn: 'Check in on their workload: "Looks intense and exciting, is there anything I can assist with?"',
        impact: {
          indicators: { empathy: 2, initiative: 1 },
          relationships: { pikoTrust: 2, festivalPlan: 1 },
        },
        reactionSceneId: 'ch1_d2_react',
      },
      {
        id: 'ch1_d2_c3',
        labelId: 'Perkenalkan diri dengan jujur: "Halo teman-teman, aku peserta baru. Boleh ikut menyimak ide kalian?"',
        labelEn: 'Introduce yourself authentically: "Hi everyone, I am new here. May I listen in on your ideas?"',
        impact: {
          indicators: { authenticity: 2, initiative: 1 },
          relationships: { pikoTrust: 1 },
        },
        reactionSceneId: 'ch1_d2_react',
      },
    ],
  },
  'ch1_d2_react': {
    id: 'ch1_d2_react',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'excited',
    companionEmote: 'happy',
    textId: 'Kelompok panitia langsung menyambutmu dengan hangat! Sekarang mari kita bungkus percakapan pertama ini sebelum menuju Quiet Garden.',
    textEn: 'The team welcomed you with open arms! Now let us wrap up this first conversation before heading to Quiet Garden.',
    nextSceneId: 'ch1_d3',
  },

  // Decision 3
  'ch1_d3': {
    id: 'ch1_d3',
    chapter: 1,
    isDecision: true,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'neutral',
    npcEmote: 'heart',
    companionEmote: 'wave',
    textId: 'Bagaimana caramu menutup percakapan pertama ini secara bermakna?',
    textEn: 'How do you choose to wrap up this first encounter meaningfully?',
    choices: [
      {
        id: 'ch1_d3_c1',
        labelId: '"Terima kasih banyak Piko! Sampai jumpa di gladi bersih nanti, semangat persiapannya!"',
        labelEn: '"Thanks a lot Piko! See you at the rehearsal later, keep up the great work!"',
        impact: {
          indicators: { initiative: 1, empathy: 2 },
          relationships: { pikoTrust: 2 },
        },
        reactionSceneId: 'ch1_d3_react',
      },
      {
        id: 'ch1_d3_c2',
        labelId: '"Obrolan kita sangat berkesan. Senang bisa kenal Piko secara nyata, sampai bertemu lagi!"',
        labelEn: '"Our chat was really memorable. So glad to connect authentically, see you around!"',
        impact: {
          indicators: { authenticity: 2, empathy: 1 },
          relationships: { pikoTrust: 2 },
        },
        reactionSceneId: 'ch1_d3_react',
      },
      {
        id: 'ch1_d3_c3',
        labelId: '"Aku pamit ke Quiet Garden ya. Jika ada perubahan denah festival, beri tahu aku nanti."',
        labelEn: '"Heading to Quiet Garden now. If there are updates on the festival map, keep me posted."',
        impact: {
          indicators: { adaptability: 2, initiative: 1 },
          relationships: { pikoTrust: 1, festivalPlan: 1 },
        },
        reactionSceneId: 'ch1_d3_react',
      },
    ],
  },
  'ch1_d3_react': {
    id: 'ch1_d3_react',
    chapter: 1,
    speaker: 'Piko',
    npcId: 'piko',
    npcExpression: 'happy',
    npcEmote: 'wave',
    companionEmote: 'sparkle',
    textId: 'Piko melambaikan tangannya dengan ceria. "Sampai jumpa! Di Quiet Garden, kamu akan bertemu Nori si pembuat lentera bambu yang lembut."',
    textEn: 'Piko waves with a wide smile. "See you soon! In the Quiet Garden, you will meet gentle Nori, our gifted lantern craftsman."',
    nextSceneId: 'interlude_1_game',
  },

  // ==================== INTERLUDE 1: ARCADE STARFALL CATCHER ====================
  'interlude_1_game': {
    id: 'interlude_1_game',
    chapter: 1,
    isInterludeGame: 'starfall_catcher',
    nextSceneId: 'ch2_intro',
    speaker: 'Piko',
    npcId: 'piko',
    textId: 'Kembang api festival meletup di langit alun-alun! Tangkap semua bintang persahabatan yang berjatuhan!',
    textEn: 'Festival fireworks burst in the square sky! Catch the falling friendship stars!',
  },

  // ==================== CHAPTER 2: QUIET GARDEN ====================
  'ch2_intro': {
    id: 'ch2_intro',
    chapter: 2,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'neutral',
    npcEmote: 'thinking',
    companionEmote: 'happy',
    textId: 'Suasana di Quiet Garden begitu hening dan sejuk. Di bawah pohon willow, tampak Nori sedang melukis lentera bambu dengan sangat teliti.',
    textEn: 'The Quiet Garden feels serene and refreshing. Under a willow tree, Nori is carefully painting delicate bamboo lanterns.',
    nextSceneId: 'ch2_d4',
  },

  // Decision 4
  'ch2_d4': {
    id: 'ch2_d4',
    chapter: 2,
    isDecision: true,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'thinking',
    npcEmote: 'thinking',
    companionEmote: 'thinking',
    textId: 'Nori tampak sangat fokus dan belum menyadari kehadiranmu. Bagaimana caramu mendekatinya tanpa mengagetkannya?',
    textEn: 'Nori looks deeply absorbed. How do you approach respectfully without startling them?',
    choices: [
      {
        id: 'ch2_d4_c1',
        labelId: 'Duduk di bangku taman terdekat, menunggu jeda kerjanya, lalu menyapa dengan suara lembut.',
        labelEn: 'Sit on a nearby bench, wait for a natural pause, then greet in a gentle tone.',
        impact: {
          indicators: { empathy: 2, adaptability: 2 },
          relationships: { noriComfort: 2 },
        },
        reactionSceneId: 'ch2_d4_react',
      },
      {
        id: 'ch2_d4_c2',
        labelId: 'Beri salam hangat dari jarak nyaman: "Halo Nori, permisi... lukisan lenteramu indah sekali."',
        labelEn: 'Warm greeting from a comfortable distance: "Hello Nori, pardon me... your lantern art is stunning."',
        impact: {
          indicators: { empathy: 2, initiative: 1 },
          relationships: { noriComfort: 1, festivalPlan: 1 },
        },
        reactionSceneId: 'ch2_d4_react',
      },
      {
        id: 'ch2_d4_c3',
        labelId: 'Sapukan tangan pelan: "Hai Nori, aku peserta baru. Piko menceritakan karya hebatmu."',
        labelEn: 'Wave gently: "Hi Nori, I am new here. Piko told me about your wonderful lanterns."',
        impact: {
          indicators: { authenticity: 2, initiative: 1 },
          relationships: { noriComfort: 1 },
        },
        reactionSceneId: 'ch2_d4_react',
      },
    ],
  },
  'ch2_d4_react': {
    id: 'ch2_d4_react',
    chapter: 2,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'happy',
    npcEmote: 'heart',
    companionEmote: 'sparkle',
    textId: 'Nori mendongak dan tersenyum tenang. "Terima kasih sudah menyapa dengan begitu lembut. Maukah kamu membantuku menyalakan lentera-lentera ini?"',
    textEn: 'Nori looks up with a serene smile. "Thank you for approaching so gently. Would you help me light these lanterns along the path?"',
    nextSceneId: 'ch2_mini_lantern',
  },

  // Interactive Mini-Action: Nyalakan Lentera Nori
  'ch2_mini_lantern': {
    id: 'ch2_mini_lantern',
    chapter: 2,
    isMiniGame: 'lantern',
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'happy',
    npcEmote: 'sparkle',
    companionEmote: 'excited',
    textId: 'Sentuh ketiga lentera bambu Nori untuk menyalakannya satu per satu!',
    textEn: 'Tap all 3 of Nori\'s bamboo lanterns to light them up one by one!',
    nextSceneId: 'ch2_d5',
  },

  // Decision 5
  'ch2_d5': {
    id: 'ch2_d5',
    chapter: 2,
    isDecision: true,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'thinking',
    npcEmote: 'thinking',
    companionEmote: 'thinking',
    textId: 'Nori bercerita: "Panitia memintaku tampil di panggung utama, tapi keramaian selalu membuatku cemas..." Bagaimana respons empatimu?',
    textEn: 'Nori shares: "The committee asked me to present on stage, but big crowds always make me anxious..." How do you respond?',
    choices: [
      {
        id: 'ch2_d5_c1',
        labelId: 'Validasi rasa: "Rasa cemas itu sangat manusiawi, Nori. Kamu tidak harus memaksakan diri tampil di panggung."',
        labelEn: 'Validate: "That anxiety is completely valid, Nori. You don\'t have to force yourself on stage."',
        impact: {
          indicators: { empathy: 2, authenticity: 2 },
          relationships: { noriComfort: 2 },
        },
        reactionSceneId: 'ch2_d5_react',
      },
      {
        id: 'ch2_d5_c2',
        labelId: 'Tawarkan opsi adaptif: "Bagaimana kalau lenteramu dipajang di jalan setapak taman agar karyamu bercerita sendiri?"',
        labelEn: 'Adaptive idea: "What if your lanterns line the quiet path, letting the art speak for itself?"',
        impact: {
          indicators: { adaptability: 2, initiative: 2 },
          relationships: { noriComfort: 2, festivalPlan: 2 },
        },
        reactionSceneId: 'ch2_d5_react',
      },
      {
        id: 'ch2_d5_c3',
        labelId: 'Bagi pengalaman otentik: "Aku juga sering gugup di kelompok besar. Yang penting kenyamananmu dihargai."',
        labelEn: 'Authentic solidarity: "I get nervous in crowds too. What matters is honouring your comfort."',
        impact: {
          indicators: { authenticity: 2, empathy: 1 },
          relationships: { noriComfort: 2 },
        },
        reactionSceneId: 'ch2_d5_react',
      },
    ],
  },
  'ch2_d5_react': {
    id: 'ch2_d5_react',
    chapter: 2,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'happy',
    npcEmote: 'heart',
    companionEmote: 'heart',
    textId: 'Nori tersenyum lega. "Terima kasih atas pengertianmu. Kini aku siap menentukan langkah untuk festival sore ini."',
    textEn: 'Nori smiles with relief. "Thank you for understanding so deeply. Now I feel ready to finalize the lantern setup."',
    nextSceneId: 'ch2_d6',
  },

  // Decision 6
  'ch2_d6': {
    id: 'ch2_d6',
    chapter: 2,
    isDecision: true,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'neutral',
    npcEmote: 'sparkle',
    companionEmote: 'wave',
    textId: 'Bagaimana caramu memberi ruang dan waktu tanpa membuat Nori merasa terabaikan?',
    textEn: 'How do you give Nori space while keeping the connection warm?',
    choices: [
      {
        id: 'ch2_d6_c1',
        labelId: '"Lanjutkan lenteramu dengan tenang, Nori. Aku akan mampir lagi nanti sore sebelum festival."',
        labelEn: '"Take your time with the lanterns, Nori. I will check back before the festival."',
        impact: {
          indicators: { empathy: 2, adaptability: 1 },
          relationships: { noriComfort: 2 },
        },
        reactionSceneId: 'ch2_d6_react',
      },
      {
        id: 'ch2_d6_c2',
        labelId: '"Aku bantu bawakan kuas cadangan ke bangku ini, setelah itu aku pamit ke Community Workshop."',
        labelEn: '"Let me bring extra brushes to your bench, then I will head to Community Workshop."',
        impact: {
          indicators: { initiative: 2, empathy: 1 },
          relationships: { noriComfort: 1, festivalPlan: 1 },
        },
        reactionSceneId: 'ch2_d6_react',
      },
      {
        id: 'ch2_d6_c3',
        labelId: '"Terima kasih sudah berbagi cerita jujur denganku hari ini. Percayalah pada karyamu."',
        labelEn: '"Thank you for sharing your honest thoughts today. Believe in your unique art."',
        impact: {
          indicators: { authenticity: 2, empathy: 1 },
          relationships: { noriComfort: 2 },
        },
        reactionSceneId: 'ch2_d6_react',
      },
    ],
  },
  'ch2_d6_react': {
    id: 'ch2_d6_react',
    chapter: 2,
    speaker: 'Nori',
    npcId: 'nori',
    npcExpression: 'happy',
    npcEmote: 'wave',
    companionEmote: 'sparkle',
    textId: 'Nori mengangguk teduh. "Terima kasih banyak. Jika kamu ke Community Workshop, sampaikan salamku pada Bumi ya!"',
    textEn: 'Nori nods warmly. "Thank you so much. If you visit Community Workshop, please send my greetings to Bumi!"',
    nextSceneId: 'interlude_2_game',
  },

  // ==================== INTERLUDE 2: ARCADE LANTERN BRIDGE CIRCUIT ====================
  'interlude_2_game': {
    id: 'interlude_2_game',
    chapter: 2,
    isInterludeGame: 'bridge_circuit',
    nextSceneId: 'ch3_intro',
    speaker: 'Nori',
    npcId: 'nori',
    textId: 'Lentera di atas jembatan lembah sungai perlu dialiri kembali! Putar ubin pipa bambu untuk menyambungkan cahaya ke bengkel Bumi.',
    textEn: 'The valley river bridge lanterns need power! Rotate the bamboo conduits to link the light to Bumi\'s workshop.',
  },

  // ==================== CHAPTER 3: COMMUNITY WORKSHOP ====================
  'ch3_intro': {
    id: 'ch3_intro',
    chapter: 3,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'neutral',
    npcEmote: 'thinking',
    companionEmote: 'thinking',
    textId: 'Di Community Workshop, palu berdenting sibuk! Bumi berdiri di tengah meja kerja bersama dua tim panitia yang sedang berdebat sengit soal tata ruang.',
    textEn: 'Inside Community Workshop, tools are clicking! Bumi stands by the workbench between two committee groups in heated dispute.',
    nextSceneId: 'ch3_d7',
  },

  // Decision 7
  'ch3_d7': {
    id: 'ch3_d7',
    chapter: 3,
    isDecision: true,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'thinking',
    npcEmote: 'lightbulb',
    companionEmote: 'thinking',
    textId: 'Tim A ingin seluruh ruang untuk panggung musik orkestra. Tim B ingin ruang untuk stan interaktif warga. Bagaimana caramu mendengarkan kedua pihak?',
    textEn: 'Team A wants the whole hall for orchestra. Team B wants interactive craft booths. How do you listen to both?',
    choices: [
      {
        id: 'ch3_d7_c1',
        labelId: 'Ajak duduk melingkar: "Mari kita dengarkan tujuan utama dari Tim A dan Tim B secara bergantian."',
        labelEn: 'Form a circle: "Let us hear the core goals from Team A and Team B alternately with active listening."',
        impact: {
          indicators: { empathy: 2, initiative: 2 },
          relationships: { festivalPlan: 2 },
        },
        reactionSceneId: 'ch3_d7_react',
      },
      {
        id: 'ch3_d7_c2',
        labelId: 'Petakan kesamaan: "Kalian berdua sama-sama ingin festival ini berkesan bagi warga, kan? Mari cari titik temunya."',
        labelEn: 'Find common ground: "Both of you share the same passion for an unforgettable festival. Let us find common ground."',
        impact: {
          indicators: { adaptability: 2, empathy: 2 },
          relationships: { festivalPlan: 2 },
        },
        reactionSceneId: 'ch3_d7_react',
      },
      {
        id: 'ch3_d7_c3',
        labelId: 'Apresiasi semangat mereka: "Hebat sekali melihat dedikasi kalian. Sekarang saatnya saling menghormati."',
        labelEn: 'Appreciate dedication: "Inspiring to see such deep dedication. Now let us channel it constructively."',
        impact: {
          indicators: { authenticity: 2, initiative: 1 },
          relationships: { festivalPlan: 1 },
        },
        reactionSceneId: 'ch3_d7_react',
      },
    ],
  },
  'ch3_d7_react': {
    id: 'ch3_d7_react',
    chapter: 3,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'impressed',
    npcEmote: 'sparkle',
    companionEmote: 'excited',
    textId: 'Bumi tersenyum lebar! "Tepat sekali. Sebelum memutuskan denah akhir, mari kita satukan kedua kubu dengan jembatan kolaborasi!"',
    textEn: 'Bumi beams! "Spot on! Before we finalize the layout, let us build a collaborative bridge between both teams!"',
    nextSceneId: 'ch3_mini_bridge',
  },

  // Interactive Mini-Action: Jembatan Harmoni
  'ch3_mini_bridge': {
    id: 'ch3_mini_bridge',
    chapter: 3,
    isMiniGame: 'bridge',
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'happy',
    npcEmote: 'heart',
    companionEmote: 'sparkle',
    textId: 'Sentuh jembatan penghubung di bawah ini untuk menyatukan Tim Musik dan Tim Stan Warga!',
    textEn: 'Tap the bridge button below to unite the Music Team and the Craft Team!',
    nextSceneId: 'ch3_d8',
  },

  // Decision 8
  'ch3_d8': {
    id: 'ch3_d8',
    chapter: 3,
    isDecision: true,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'neutral',
    npcEmote: 'lightbulb',
    companionEmote: 'thinking',
    textId: 'Bagaimana usulan solusimu untuk menyatukan panggung musik dan stan interaktif?',
    textEn: 'What collaborative solution do you propose for stage and booths?',
    choices: [
      {
        id: 'ch3_d8_c1',
        labelId: 'Desain modular: Panggung terbuka di tengah, dikelilingi stan interaktif lentera yang harmonis.',
        labelEn: 'Modular hybrid: Open central stage gracefully surrounded by interactive craft booths.',
        impact: {
          indicators: { initiative: 2, adaptability: 2 },
          relationships: { festivalPlan: 3 },
        },
        reactionSceneId: 'ch3_d8_react',
      },
      {
        id: 'ch3_d8_c2',
        labelId: 'Pembagian sesi waktu: Siang untuk stan interaktif, malam hari untuk konser akbar.',
        labelEn: 'Time scheduling: Afternoon for interactive booths, evening for gala concerts.',
        impact: {
          indicators: { adaptability: 2, empathy: 2 },
          relationships: { festivalPlan: 2 },
        },
        reactionSceneId: 'ch3_d8_react',
      },
      {
        id: 'ch3_d8_c3',
        labelId: 'Setiap tim memilih satu fitur terpenting untuk digabungkan menjadi konsep pameran baru.',
        labelEn: 'Each team picks their key priority to fuse into a brand new exhibition concept.',
        impact: {
          indicators: { authenticity: 2, empathy: 2 },
          relationships: { festivalPlan: 2 },
        },
        reactionSceneId: 'ch3_d8_react',
      },
    ],
  },
  'ch3_d8_react': {
    id: 'ch3_d8_react',
    chapter: 3,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'impressed',
    npcEmote: 'sparkle',
    companionEmote: 'excited',
    textId: 'Bumi bertepuk tangan bangga! "Brilian! Semua tim merasa dihargai dan memiliki ruang berkarya!"',
    textEn: 'Bumi claps proudly! "Brilliant! Every team feels respected with meaningful creative space!"',
    nextSceneId: 'ch3_d9',
  },

  // Decision 9
  'ch3_d9': {
    id: 'ch3_d9',
    chapter: 3,
    isDecision: true,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'happy',
    npcEmote: 'heart',
    companionEmote: 'sparkle',
    textId: 'Bagaimana caramu mengunci komitmen bersama ini untuk menjaga harmoni tim ke depan?',
    textEn: 'How do you finalize this group commitment to sustain teamwork harmony?',
    choices: [
      {
        id: 'ch3_d9_c1',
        labelId: '"Mari kita rayakan kolaborasi ini! Jika ada kendala teknis nanti, kita atasi bersama secara terbuka."',
        labelEn: '"Let us celebrate this collaboration! If hurdles arise, we solve them with open communication."',
        impact: {
          indicators: { initiative: 2, authenticity: 2 },
          relationships: { festivalPlan: 3 },
        },
        reactionSceneId: 'ch3_finish',
      },
      {
        id: 'ch3_d9_c2',
        labelId: '"Terima kasih atas kedewasaan semua tim. Mendengarkan perbedaan adalah kekuatan terbesar kita."',
        labelEn: '"Thank you for everyone\'s open-mindedness. Listening across differences is our greatest power."',
        impact: {
          indicators: { empathy: 2, adaptability: 2 },
          relationships: { festivalPlan: 3 },
        },
        reactionSceneId: 'ch3_finish',
      },
      {
        id: 'ch3_d9_c3',
        labelId: '"Setiap orang telah memberikan yang terbaik. Mari kita nyalakan lentera pertama bersama!"',
        labelEn: '"Everyone brought their authentic best. Let us light the first festival lantern together!"',
        impact: {
          indicators: { authenticity: 2, initiative: 1 },
          relationships: { festivalPlan: 3 },
        },
        reactionSceneId: 'ch3_finish',
      },
    ],
  },

  // Finale Scene
  'ch3_finish': {
    id: 'ch3_finish',
    chapter: 3,
    speaker: 'Bumi',
    npcId: 'bumi',
    npcExpression: 'happy',
    npcEmote: 'excited',
    companionEmote: 'sparkle',
    textId: 'Lonceng Festival Harmoni Connectopia berdentang merdu! Lentera Nori menyala berkilauan, tawa Piko menggema, dan stan kreasi Bumi dipenuhi warga. Petualanganmu di Connectopia telah membuahkan hasil luar biasa!',
    textEn: 'The Harmony Festival chime echoes joyfully across Connectopia! Nori\'s lanterns glow warmly, Piko\'s laughter rings out, and Bumi\'s collaborative booths are bustling with happy visitors. Your journey has sparked something truly extraordinary!',
    nextSceneId: null, // triggers ending navigation
  },
};

// Calculate deterministic ending based on player choices and indicator totals
export function calculateEnding(indicators) {
  const { initiative = 0, empathy = 0, adaptability = 0, authenticity = 0 } = indicators;

  const empathyAdapt = empathy + adaptability;
  const initAuth = initiative + authenticity;

  if (empathyAdapt > initAuth + 1) {
    return 'bridge_builder';
  } else if (initAuth > empathyAdapt + 1) {
    return 'growing_connector';
  } else {
    return 'curious_explorer';
  }
}

export const ENDINGS_DATA = {
  bridge_builder: {
    id: 'bridge_builder',
    titleId: 'The Bridge Builder',
    titleEn: 'The Bridge Builder',
    subtitleId: 'Sosok Penjembatan & Pendengar Penuh Empati',
    subtitleEn: 'The Empathic Listener & Harmonizer',
    descId: 'Dalam situasi sosial baru, kekuatan terbesarmu adalah mendengarkan dengan penuh empati, menghargai batas kenyamanan orang lain, dan merangkul perbedaan sudut pandang. Kamu menciptakan rasa aman bagi orang-orang di sekitarmu.',
    descEn: 'In new social environments, your greatest gift is deep active listening, respecting personal boundaries, and bridging differing perspectives. You create psychological safety wherever you go.',
    strengthsId: ['Active Listening', 'Empati & Validasi Rasa', 'Adaptabilitas Komunikasi', 'Peredam Ketegangan'],
    strengthsEn: ['Active Listening', 'Empathy & Validation', 'Communicative Adaptability', 'De-escalation'],
    badgeColor: 'emerald',
  },
  growing_connector: {
    id: 'growing_connector',
    titleId: 'The Growing Connector',
    titleEn: 'The Growing Connector',
    subtitleId: 'Penggerak Inisiatif & Otentisitas Tulus',
    subtitleEn: 'The Proactive & Authentic Initiator',
    descId: 'Kamu tidak ragu mengambil inisiatif untuk menyapa terlebih dahulu, menawarkan bantuan nyata, dan mengekspresikan dirimu secara otentik. Kejujuran dan energimu menginspirasi orang lain untuk keluar dari zona nyaman mereka.',
    descEn: 'You boldly take the first step to greet others, offer tangible support, and present your true self without pretense. Your genuine energy inspires others to open up and connect.',
    strengthsId: ['Inisiatif Memulai', 'Komunikasi Terbuka & Jujur', 'Orientasi Solusi Bersama', 'Keberanian Sosial'],
    strengthsEn: ['Proactive Outreach', 'Authentic Expression', 'Collaborative Action', 'Social Courage'],
    badgeColor: 'amber',
  },
  curious_explorer: {
    id: 'curious_explorer',
    titleId: 'The Curious Explorer',
    titleEn: 'The Curious Explorer',
    subtitleId: 'Penjelajah Sosial Adaptif & Penuh Eksplorasi',
    subtitleEn: 'The Adaptive & Curious Social Explorer',
    descId: 'Gayamu sangat dinamis dan luwes. Kamu peka membaca situasi, fleksibel menyesuaikan diri dengan berbagai tipe kepribadian, dan selalu penasaran untuk belajar dari setiap interaksi sosial yang kamu temui.',
    descEn: 'Your style is wonderfully flexible and balanced. You intuitively read the room, adjust comfortably to diverse personalities, and approach every conversation with wholesome curiosity.',
    strengthsId: ['Keseimbangan Sosial', 'Rasa Ingin Tahu Tinggi', 'Fleksibilitas Gaya', 'Observasi & Respons Cepat'],
    strengthsEn: ['Social Balance', 'High Curiosity', 'Style Flexibility', 'Fast Context Sensing'],
    badgeColor: 'violet',
  },
};
