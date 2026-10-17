import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'cq_supabase_url_v1';
const STORAGE_KEY_KEY = 'cq_supabase_key_v1';

// Read from env or local storage
function resolveCredentials() {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let storedUrl = '';
  let storedKey = '';

  if (typeof window !== 'undefined') {
    try {
      storedUrl = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
      storedKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
      // If previous stored URL had the old typo, auto-clear it
      if (storedUrl.includes('fktcfotpdbdbfglulubc')) {
        localStorage.removeItem(STORAGE_URL_KEY);
        localStorage.removeItem(STORAGE_KEY_KEY);
        storedUrl = '';
        storedKey = '';
      }
    } catch {
      // ignore storage access issues
    }
  }

  // Stored takes precedence for live in-browser testing, otherwise env
  const activeUrl = storedUrl || envUrl;
  const activeKey = storedKey || envKey;

  const isConfigured = Boolean(
    activeUrl &&
    activeKey &&
    !activeUrl.includes('your-project-id') &&
    activeUrl.startsWith('http')
  );

  const source = storedUrl ? 'storage' : (envUrl && isConfigured ? 'env' : 'none');

  return { url: activeUrl, key: activeKey, isConfigured, source };
}

let currentConfig = resolveCredentials();
let activeClient = currentConfig.isConfigured
  ? createClient(currentConfig.url, currentConfig.key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

const configListeners = new Set();

function notifyListeners() {
  currentConfig = resolveCredentials();
  if (currentConfig.isConfigured) {
    activeClient = createClient(currentConfig.url, currentConfig.key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } else {
    activeClient = null;
  }

  configListeners.forEach((fn) => {
    try {
      fn(currentConfig, activeClient);
    } catch (e) {
      console.error('Error in config listener:', e);
    }
  });
}

export function getSupabaseConfig() {
  return resolveCredentials();
}

export function setSupabaseConfig(url, key) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  }
  notifyListeners();
  return resolveCredentials();
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
  notifyListeners();
  return resolveCredentials();
}

export function onSupabaseConfigChange(listener) {
  configListeners.add(listener);
  return () => configListeners.delete(listener);
}

export const isSupabaseConfigured = currentConfig.isConfigured;

export const supabase = activeClient;

export function getSupabaseClient() {
  return activeClient;
}

// Live connectivity & latency ping test to PostgreSQL submissions table
export async function testPostgresConnection(customUrl = null, customKey = null) {
  let clientToTest = activeClient;

  if (customUrl && customKey) {
    try {
      clientToTest = createClient(customUrl.trim(), customKey.trim());
    } catch (err) {
      return { ok: false, error: `Format URL/Key salah: ${err.message}` };
    }
  }

  if (!clientToTest) {
    return {
      ok: false,
      error: 'Konfigurasi PostgreSQL belum diisi. Masukkan Supabase Project URL dan Anon Key.',
    };
  }

  const startTime = performance.now();
  try {
    const { count, error } = await clientToTest
      .from('submissions')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "submissions" does not exist')) {
        return {
          ok: false,
          code: 'TABLE_MISSING',
          latencyMs,
          error: 'Tabel "submissions" belum ditemukan di PostgreSQL. Jalankan schema.sql di Supabase SQL Editor.',
        };
      }
      return {
        ok: false,
        latencyMs,
        error: error.message || 'Gagal query tabel submissions di PostgreSQL.',
      };
    }

    return {
      ok: true,
      latencyMs,
      count: count || 0,
      message: `Terhubung sukses ke PostgreSQL! (${latencyMs}ms)`,
    };
  } catch (err) {
    const isFetchFail =
      err.message?.includes('fetch') ||
      err.name === 'TypeError' ||
      err.code === 'ENOTFOUND';

    const friendlyMsg = isFetchFail
      ? 'Tidak dapat menjangkau domain Supabase. Pastikan Project di Supabase berstatus "Active" (bukan Paused) atau cek URL persis di tombol Connect.'
      : err.message || 'Koneksi jaringan ke server PostgreSQL gagal.';

    return {
      ok: false,
      error: friendlyMsg,
    };
  }
}
