import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';

const LEADERBOARD_STORAGE_KEY = 'connection_quest_leaderboard_v1';

// Fetch all leaderboard submissions from PostgreSQL or local storage (pure real-time data only)
export async function fetchLeaderboardSubmissions() {
  const config = getSupabaseConfig();
  const supabase = getSupabaseClient();

  if (config.isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(200);

      if (error) {
        console.warn('Error querying submissions:', error);
        return {
          isLive: false,
          error: error.message,
          submissions: getLocalSubmissions(),
          count: 0,
        };
      }

      if (data && data.length > 0) {
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          homegroup: item.homegroup,
          avatarId: item.avatar_id,
          archetype: item.archetype,
          totalScore: item.total_score,
          breakdown: {
            speedScore: item.speed_score,
            arcadeScore: item.arcade_score,
            connectionScore: item.connection_score,
            ctaScore: item.cta_score,
          },
          pledge: item.pledge,
          timeAgo: formatTimeAgo(item.created_at),
          created_at: item.created_at,
          isLivePostgres: true,
        }));

        return {
          isLive: true,
          error: null,
          submissions: mapped,
          count: mapped.length,
        };
      } else {
        // Table exists in database but has 0 rows yet
        return {
          isLive: true,
          error: null,
          submissions: [],
          count: 0,
          isEmpty: true,
        };
      }
    } catch (err) {
      console.warn('Live fetch error, falling back to local storage:', err);
      const isFetchFail = err.message?.includes('fetch') || err.name === 'TypeError';
      const msg = isFetchFail
        ? 'Koneksi real-time terputus. Menampilkan data lokal.'
        : err.message;
      return {
        isLive: false,
        error: msg,
        submissions: getLocalSubmissions(),
        count: 0,
      };
    }
  }

  // Not configured: Return local storage only
  return {
    isLive: false,
    error: null,
    submissions: getLocalSubmissions(),
    count: 0,
  };
}

function getLocalSubmissions() {
  let savedLocal = [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (raw) savedLocal = JSON.parse(raw);
  } catch {
    savedLocal = [];
  }

  return savedLocal.sort((a, b) => b.totalScore - a.totalScore);
}

// Clear local submissions cache
export function clearLocalSubmissions() {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

// Subscribe to real-time WebSocket changes on submissions table
export function subscribeToLeaderboard(onEvent) {
  const config = getSupabaseConfig();
  const supabase = getSupabaseClient();

  if (!config.isConfigured || !supabase) {
    return () => {};
  }

  const channelId = `realtime-leaderboard-${Date.now()}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'submissions',
      },
      (payload) => {
        if (!payload) return;

        if (payload.eventType === 'INSERT') {
          const item = payload.new;
          if (!item) return;

          const formatted = {
            id: item.id,
            name: item.name,
            homegroup: item.homegroup,
            avatarId: item.avatar_id,
            archetype: item.archetype,
            totalScore: item.total_score,
            breakdown: {
              speedScore: item.speed_score,
              arcadeScore: item.arcade_score,
              connectionScore: item.connection_score,
              ctaScore: item.cta_score,
            },
            pledge: item.pledge,
            timeAgo: 'Baru saja',
            created_at: item.created_at,
            isLivePostgres: true,
          };

          onEvent({ type: 'INSERT', item: formatted });
        } else if (payload.eventType === 'UPDATE') {
          const item = payload.new;
          if (!item) return;

          const formatted = {
            id: item.id,
            name: item.name,
            homegroup: item.homegroup,
            avatarId: item.avatar_id,
            archetype: item.archetype,
            totalScore: item.total_score,
            breakdown: {
              speedScore: item.speed_score,
              arcadeScore: item.arcade_score,
              connectionScore: item.connection_score,
              ctaScore: item.cta_score,
            },
            pledge: item.pledge,
            timeAgo: formatTimeAgo(item.created_at),
            created_at: item.created_at,
            isLivePostgres: true,
          };

          onEvent({ type: 'UPDATE', item: formatted });
        } else if (payload.eventType === 'DELETE') {
          onEvent({ type: 'DELETE', id: payload.old?.id });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function formatTimeAgo(isoString) {
  if (!isoString) return 'Baru saja';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j lalu`;
  return `${Math.floor(diffHour / 24)}h lalu`;
}
