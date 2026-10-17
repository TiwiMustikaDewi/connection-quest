import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  getSupabaseConfig,
  setSupabaseConfig,
  clearSupabaseConfig,
  testPostgresConnection,
  getSupabaseClient,
} from '../../lib/supabase';
import { clearLocalSubmissions } from '../../services/leaderboardService';

export function DatabaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <DatabaseConfigModalContent onClose={onClose} onConfigSaved={onConfigSaved} />
    </AnimatePresence>,
    document.body
  );
}

function DatabaseConfigModalContent({ onClose, onConfigSaved }) {
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const initialConfig = getSupabaseConfig();
  const [url, setUrl] = useState(initialConfig.url || '');
  const [anonKey, setAnonKey] = useState(initialConfig.key || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testPostgresConnection(url, anonKey);
      setTestResult(res);
    } catch (err) {
      setTestResult({ ok: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setSupabaseConfig(url, anonKey);
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    if (onConfigSaved) onConfigSaved();
  };

  const handleCopySchema = async () => {
    try {
      const schemaText = `-- CONNECTION QUEST - POSTGRESQL SCHEMA FOR AFL WINTER PEAK 2026
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  homegroup text not null,
  avatar_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants(id) on delete set null,
  name text not null,
  homegroup text not null,
  avatar_id text not null,
  archetype text not null,
  total_score integer not null default 0,
  speed_score integer not null default 0,
  arcade_score integer not null default 0,
  connection_score integer not null default 0,
  cta_score integer not null default 0,
  pledge text not null default '',
  strategy text default '',
  target_environment text default '',
  indicators jsonb not null default '{}'::jsonb,
  choices jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_submissions_score on public.submissions (total_score desc);
create index if not exists idx_submissions_homegroup on public.submissions (homegroup);
create index if not exists idx_submissions_created_at on public.submissions (created_at desc);

alter table public.participants enable row level security;
alter table public.submissions enable row level security;

create policy "Allow public submissions insert" on public.submissions for insert with check (true);
create policy "Allow public submissions read" on public.submissions for select using (true);
create policy "Allow public submissions update" on public.submissions for update using (true);
create policy "Allow public submissions delete" on public.submissions for delete using (true);

create policy "Allow public participants insert" on public.participants for insert with check (true);
create policy "Allow public participants read" on public.participants for select using (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'submissions'
  ) then
    alter publication supabase_realtime add table public.submissions;
  end if;
end $$;`;

      await navigator.clipboard.writeText(schemaText);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
    } catch {
      // Fallback
      alert('Gagal menyalin otomatis. Anda bisa membuka file supabase/schema.sql');
    }
  };

  const handleResetAllSubmissions = async () => {
    const msg = isIndo
      ? 'Apakah Anda yakin ingin mengosongkan semua data submission di database untuk memulai sesi baru?'
      : 'Are you sure you want to clear all submissions in database for a fresh session?';
    if (!window.confirm(msg)) return;

    setIsResetting(true);
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from('submissions').delete().neq('total_score', -9999);
      }
      clearLocalSubmissions();
      if (onConfigSaved) onConfigSaved();
      alert(isIndo ? 'Data leaderboard berhasil di-reset!' : 'Leaderboard data reset successfully!');
    } catch (err) {
      alert(`Gagal reset data: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-amber-300 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 font-display">
                  {isIndo ? 'Pengaturan Koneksi Real-Time' : 'Real-Time Connection Settings'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isIndo ? 'Sinkronisasi Langsung 16 Homegroup' : 'Live Sync across 16 Homegroups'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Guide */}
          <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-amber-950 flex items-center justify-between">
              <span>🚀 3 Langkah Mudah Menghubungkan PostgreSQL:</span>
              <button
                type="button"
                onClick={handleCopySchema}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex items-center gap-1 cursor-pointer transition"
              >
                {copiedSchema ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? 'Tersalin!' : 'Salin schema.sql'}</span>
              </button>
            </div>
            <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>
                Buka database PostgreSQL Anda di{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-amber-800 underline"
                >
                  Supabase (Gratis)
                </a>
              </li>
              <li>
                Klik <b>SQL Editor</b>, paste script <b>schema.sql</b>, lalu klik <b>Run</b>.
              </li>
              <li>
                Buka <b>Project Settings ➔ Data API</b>, salin <b>Project URL</b> dan <b>Anon Key</b> ke form di bawah ini.
              </li>
            </ol>
          </div>

          {/* Form Credentials */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                PostgreSQL / Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !url || !anonKey}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                !url || !anonKey
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isTesting
                  ? 'bg-amber-300 text-amber-950 animate-pulse'
                  : 'bg-white border border-amber-300 text-amber-950 hover:bg-amber-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji Koneksi...' : 'Uji Koneksi Live Real-Time'}</span>
            </button>

            {testResult && (
              <div
                className={`p-3 rounded-2xl text-xs border ${
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {testResult.ok
                      ? `Koneksi Berhasil! (Ping: ${testResult.latencyMs}ms)`
                      : 'Koneksi Gagal'}
                  </span>
                </div>
                <p className="text-[11px] mt-1 text-slate-600">
                  {testResult.ok
                    ? `Ditemukan ${testResult.count} data submission di tabel submissions. Real-Time WebSocket aktif!`
                    : testResult.error}
                </p>
              </div>
            )}

          </div>

          {/* Reset Leaderboard Data Button (for fresh seminar session) */}
          {url && anonKey && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleResetAllSubmissions}
                disabled={isResetting}
                className="w-full py-2 rounded-xl text-[11px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isResetting ? 'Mengosongkan Data...' : 'Reset / Kosongkan Data Leaderboard'}</span>
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              {isIndo ? 'Putus Koneksi' : 'Disconnect'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {isIndo ? 'Tutup' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs transition cursor-pointer"
              >
                {isIndo ? 'Simpan & Terapkan' : 'Save & Apply'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
