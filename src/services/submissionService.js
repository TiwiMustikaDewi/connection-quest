import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';

const LEADERBOARD_STORAGE_KEY = 'connection_quest_leaderboard_v1';

export async function submitParticipantQuest({
  participant,
  ending,
  scoreData,
  reflection,
  indicators,
  choices,
}) {
  const payload = {
    name: participant.name || 'Anonymous Connector',
    homegroup: participant.homegroup || 'Homegroup 1',
    avatar_id: participant.avatarId || 'milo',
    archetype: ending?.titleId || 'The Bridge Builder',
    total_score: scoreData.totalScore || 0,
    speed_score: scoreData.breakdown?.speedScore || 0,
    arcade_score: scoreData.breakdown?.arcadeScore || 0,
    connection_score: scoreData.breakdown?.connectionScore || 0,
    cta_score: scoreData.breakdown?.ctaScore || 0,
    pledge: reflection?.nextAction || '',
    strategy: reflection?.strategyToPractice || '',
    target_environment: reflection?.targetEnvironment || '',
    indicators: indicators || {},
    choices: choices || [],
    created_at: new Date().toISOString(),
  };

  // 1. Cache to local storage (for offline resilience and instant local feedback)
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(
      (item) => item.name.toLowerCase() !== payload.name.toLowerCase()
    );
    const updated = [
      {
        ...payload,
        id: `local-${Date.now()}`,
        timeAgo: 'Baru saja',
        breakdown: scoreData.breakdown,
        totalScore: payload.total_score,
        avatarId: payload.avatar_id,
        archetype: payload.archetype,
        name: payload.name,
        homegroup: payload.homegroup,
        pledge: payload.pledge,
      },
      ...filtered,
    ];
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not cache submission to localStorage:', err);
  }

  // 2. Submit to PostgreSQL via Supabase if configured
  const config = getSupabaseConfig();
  const supabase = getSupabaseClient();

  if (config.isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([payload])
        .select();

      if (error) {
        console.error('PostgreSQL insert error in submissions:', error);
        return { success: false, error: error.message, isLive: true };
      }

      return { success: true, data: data?.[0], isLive: true };
    } catch (err) {
      console.error('PostgreSQL connection error during submission:', err);
      return { success: false, error: err.message, isLive: false };
    }
  }

  return { success: true, isLive: false };
}

// Generate an instant test submission into PostgreSQL to test live WebSocket sync
export async function createSamplePostgresSubmission(homegroupNumber = 1) {
  const hg = `Homegroup ${homegroupNumber}`;
  const randomNames = [
    'Raka Pratama', 'Alya Zahra', 'Dimas Arya', 'Nadia Putri',
    'Budi Santoso', 'Siti Rahma', 'Kevin Wijaya', 'Clara Renata',
  ];
  const archetypes = [
    'The Bridge Builder',
    'The Empathetic Anchor',
    'The Spark Catalyst',
  ];
  const avatars = ['milo', 'lumi', 'kiko'];

  const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomSuffix = Math.floor(10 + Math.random() * 89);
  const fullName = `${randomName} #${randomSuffix}`;

  const speedScore = Math.floor(180 + Math.random() * 65);
  const arcadeScore = Math.floor(260 + Math.random() * 85);
  const connectionScore = Math.floor(190 + Math.random() * 55);
  const ctaScore = Math.floor(110 + Math.random() * 35);
  const totalScore = speedScore + arcadeScore + connectionScore + ctaScore;

  const payload = {
    name: fullName,
    homegroup: hg,
    avatar_id: avatars[Math.floor(Math.random() * avatars.length)],
    archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
    total_score: totalScore,
    speed_score: speedScore,
    arcade_score: arcadeScore,
    connection_score: connectionScore,
    cta_score: ctaScore,
    pledge: 'Membangun jembatan komunikasi aktif di Homegroup selama 48 jam ke depan.',
    strategy: 'Active Listening & Sapaan Hangat',
    target_environment: 'Homegroup & Circle Terdekat',
    indicators: { initiative: 75, empathy: 85, adaptability: 80, authenticity: 90 },
    choices: ['ch1_approach_warmly', 'ch2_listen_first'],
    created_at: new Date().toISOString(),
  };

  const config = getSupabaseConfig();
  const supabase = getSupabaseClient();

  if (config.isConfigured && supabase) {
    const { data, error } = await supabase.from('submissions').insert([payload]).select();
    if (error) throw new Error(error.message);
    return { isLive: true, data: data?.[0] };
  } else {
    // Save to local storage
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const entry = {
      ...payload,
      id: `local-test-${Date.now()}`,
      timeAgo: 'Baru saja',
      breakdown: {
        speedScore,
        arcadeScore,
        connectionScore,
        ctaScore,
      },
      totalScore,
      avatarId: payload.avatar_id,
    };
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify([entry, ...existing]));
    return { isLive: false, data: entry };
  }
}
