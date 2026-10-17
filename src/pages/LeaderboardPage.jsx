import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Users,
  Search,
  ArrowLeft,
  Sparkles,
  Zap,
  Clock,
  Heart,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { AvatarSprite } from '../components/characters/AvatarSprite';
import { Card } from '../components/common/Card';
import { DatabaseConfigModal } from '../components/common/DatabaseConfigModal';
import { HOMEGROUP_OPTIONS } from '../data/homegroups';
import { calculateTotalScore } from '../lib/scoring';
import { sound } from '../lib/sound';
import {
  fetchLeaderboardSubmissions,
  subscribeToLeaderboard,
} from '../services/leaderboardService';
import { onSupabaseConfigChange } from '../lib/supabase';

export function LeaderboardPage() {
  const { language } = useLanguage();
  const { state, resetGame } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isIndo = language === 'id';

  // Admin access protection: Developer/Admin settings only accessible via ?admin=true or ?admin=afl2026
  const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('admin') === 'afl2026';

  const [activeTab, setActiveTab] = useState('homegroup'); // 'homegroup' | 'individual'
  const [selectedHomegroupFilter, setSelectedHomegroupFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  // Real-time data state (Pure real-time data only)
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLivePostgres, setIsLivePostgres] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [liveNotice, setLiveNotice] = useState(null);

  // Load live data from real-time service
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchLeaderboardSubmissions();
      setIsLivePostgres(res.isLive);
      setDbError(res.error || null);
      setSubmissions(res.submissions || []);
    } catch (err) {
      console.error('Failed to load live leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and Realtime WebSocket Subscription
  useEffect(() => {
    loadData();

    // Subscribe to live WebSocket changes
    const unsubscribe = subscribeToLeaderboard((event) => {
      if (event.type === 'INSERT') {
        const newItem = event.item;
        setSubmissions((prev) => {
          const filtered = prev.filter(
            (p) => p.id !== newItem.id && p.name.toLowerCase() !== newItem.name.toLowerCase()
          );
          const updated = [newItem, ...filtered];
          return updated.sort((a, b) => b.totalScore - a.totalScore);
        });

        // Trigger cheerful audio & live notification toast
        sound.playSparkle(true);
        setLiveNotice({
          name: newItem.name,
          homegroup: newItem.homegroup,
          score: newItem.totalScore,
        });
        setTimeout(() => setLiveNotice(null), 5000);
      } else if (event.type === 'UPDATE') {
        const updatedItem = event.item;
        setSubmissions((prev) => {
          const updated = prev.map((p) => (p.id === updatedItem.id ? updatedItem : p));
          return updated.sort((a, b) => b.totalScore - a.totalScore);
        });
      } else if (event.type === 'DELETE') {
        setSubmissions((prev) => prev.filter((p) => p.id !== event.id));
      }
    });

    // Listen for database configuration changes
    const unsubConfig = onSupabaseConfigChange(() => {
      loadData();
    });

    return () => {
      unsubscribe();
      unsubConfig();
    };
  }, [loadData]);

  // Current local participant entry if completed
  const currentParticipantEntry = useMemo(() => {
    if (!state.participant.name || !state.participant.homegroup) return null;

    let savedReflection = {};
    try {
      const raw = localStorage.getItem('connection_quest_reflection_v1');
      if (raw) savedReflection = JSON.parse(raw);
    } catch {
      // ignore
    }

    const { totalScore, breakdown } = calculateTotalScore({
      indicators: state.indicators,
      choices: state.choices,
      reflection: savedReflection,
      arcadeScore: 285,
    });

    const archetype =
      state.ending === 'bridge_builder'
        ? 'The Bridge Builder'
        : state.ending === 'growing_connector'
        ? 'The Empathetic Anchor'
        : 'The Spark Catalyst';

    return {
      id: 'current-user',
      isCurrentUser: true,
      name: state.participant.name,
      homegroup: state.participant.homegroup,
      avatarId: state.participant.avatarId || 'milo',
      archetype,
      totalScore,
      breakdown,
      pledge: savedReflection.nextAction || 'Siap menjalin koneksi yang lebih hangat.',
      timeAgo: isIndo ? 'Baru saja' : 'Just now',
    };
  }, [state, isIndo]);

  // Merged individuals (Pure real submissions)
  const allIndividuals = useMemo(() => {
    const list = [...submissions];

    // If current participant completed quest and not already in list, inject them
    if (
      currentParticipantEntry &&
      !list.some((e) => e.name.toLowerCase() === currentParticipantEntry.name.toLowerCase())
    ) {
      list.unshift(currentParticipantEntry);
    }

    return list.sort((a, b) => b.totalScore - a.totalScore);
  }, [submissions, currentParticipantEntry]);

  // Filtered individuals
  const filteredIndividuals = useMemo(() => {
    return allIndividuals.filter((item) => {
      const matchesHomegroup =
        selectedHomegroupFilter === 'ALL' || item.homegroup === selectedHomegroupFilter;
      const matchesSearch =
        !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesHomegroup && matchesSearch;
    });
  }, [allIndividuals, selectedHomegroupFilter, searchQuery]);

  // Homegroup Aggregated Standings (Across all 16 Homegroups)
  const homegroupStandings = useMemo(() => {
    const groupStats = {};

    // Initialize all 16 Homegroups
    HOMEGROUP_OPTIONS.forEach((hg) => {
      groupStats[hg] = {
        name: hg,
        totalScore: 0,
        count: 0,
        participants: [],
      };
    });

    // Populate data
    allIndividuals.forEach((p) => {
      if (groupStats[p.homegroup]) {
        groupStats[p.homegroup].totalScore += p.totalScore;
        groupStats[p.homegroup].count += 1;
        groupStats[p.homegroup].participants.push(p);
      }
    });

    // Compute averages and sort
    const list = Object.values(groupStats).map((g) => {
      const avgScore = g.count > 0 ? Math.round(g.totalScore / g.count) : 0;
      return {
        ...g,
        avgScore,
      };
    });

    return list.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.avgScore - a.avgScore;
    });
  }, [allIndividuals]);

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full py-2 space-y-4">
      {/* Live Push Notification Toast */}
      <AnimatePresence>
        {liveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 text-xs max-w-md w-[92%]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex-1">
              <span className="font-extrabold text-amber-300">🔴 LIVE: </span>
              <span className="font-bold">{liveNotice.name}</span>
              <span className="text-slate-300"> ({liveNotice.homegroup}) baru saja menyelesaikan quest! </span>
              <span className="font-black text-amber-400">+{liveNotice.score} pts</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Navigation & Live Status Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/90 border border-amber-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-xs"
          title="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Live Real-Time Status Pill (Passive visual status for participants, non-clickable) */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs select-none ${
              isLivePostgres
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLivePostgres ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isLivePostgres ? 'Live Real-Time' : isIndo ? 'Offline' : 'Offline'}</span>
          </div>

          {/* Secret Developer / Admin Button: ONLY visible if ?admin=true is in URL */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowDbModal(true)}
              className="px-2.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-[11px] font-bold cursor-pointer transition shadow-2xs flex items-center gap-1"
              title="Pengaturan Database Developer"
            >
              <span>⚙️ Dev</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFormulaModal(true)}
          className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition cursor-pointer shadow-xs"
          title="Lihat Cara Perhitungan Poin"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Main Title & Subtitle */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display flex items-center justify-center gap-2">
          <span>🏆</span>
          <span>{isIndo ? 'Leaderboard Real-Time' : 'Real-Time Leaderboard'}</span>
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          {isIndo
            ? 'Peringkat langsung 16 Homegroup AFL Winter Peak 2026 secara live real-time.'
            : 'Live standings across all 16 Homegroups in AFL Winter Peak 2026.'}
        </p>
      </div>

      {/* Database Error Banner if any */}
      {dbError && (
        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="truncate">{dbError}</span>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowDbModal(true)}
              className="text-[11px] font-bold text-rose-800 underline shrink-0 cursor-pointer hover:text-rose-950"
            >
              {isIndo ? 'Periksa (Dev)' : 'Check (Dev)'}
            </button>
          )}
        </div>
      )}

      {/* Real-time Submissions Indicator (Pure Real-Time Only, Simulation Section Removed) */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-bold text-slate-800">{allIndividuals.length}</span>
          <span>{isIndo ? 'peserta tercatat' : 'participants recorded'}</span>
          {isLivePostgres && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              ⚡ Terhubung Langsung
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="p-1.5 rounded-xl bg-white border border-amber-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200">
        <button
          type="button"
          onClick={() => setActiveTab('homegroup')}
          className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'homegroup'
              ? 'bg-white text-amber-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>{isIndo ? 'Klasemen 16 Homegroup' : '16 Homegroup Standings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('individual')}
          className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'individual'
              ? 'bg-white text-amber-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{isIndo ? 'Peringkat Individu' : 'Individual Rankings'}</span>
        </button>
      </div>

      {/* Empty State Banner (When 0 submissions exist) */}
      {allIndividuals.length === 0 && !isLoading && (
        <Card variant="glass" className="p-6 text-center space-y-3 border-2 border-dashed border-amber-300">
          <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-800 text-xl">
            🏆
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800">
              {isIndo ? 'Belum Ada Peserta yang Tercatat' : 'No Submissions Yet'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
              {isIndo
                ? 'Setiap peserta dari 16 Homegroup yang menyelesaikan quest di perangkat mana pun akan otomatis muncul di sini secara live real-time.'
                : 'Every participant from the 16 Homegroups who completes the quest will appear here live in real-time.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playSelect(state.soundEnabled);
                resetGame();
                navigate('/register');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-extrabold shadow-xs transition cursor-pointer"
            >
              {isIndo ? 'Mainkan Quest Sekarang' : 'Play Quest Now'}
            </button>
          </div>
        </Card>
      )}

      {/* TAB 1: HOMEGROUP STANDINGS */}
      {activeTab === 'homegroup' && (
        <div className="space-y-3">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            {/* Rank 2 (Silver) */}
            {homegroupStandings[1] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-3 border-2 border-slate-300 shadow-soft flex flex-col justify-between order-1"
              >
                <div className="text-xl">🥈</div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">{homegroupStandings[1].name}</div>
                <div className="text-xs font-extrabold text-slate-900 mt-1">{homegroupStandings[1].totalScore} pts</div>
                <span className="text-[10px] text-slate-500">{homegroupStandings[1].count} selesai</span>
              </motion.div>
            )}

            {/* Rank 1 (Gold) */}
            {homegroupStandings[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-amber-200 via-amber-100 to-white rounded-3xl p-3 border-2 border-amber-400 shadow-md flex flex-col justify-between order-2 -mt-2"
              >
                <div className="text-2xl animate-bounce">👑</div>
                <div className="text-xs font-black text-amber-950 line-clamp-1">{homegroupStandings[0].name}</div>
                <div className="text-sm font-black text-amber-900 mt-1">{homegroupStandings[0].totalScore} pts</div>
                <span className="text-[10px] font-bold text-amber-800">{homegroupStandings[0].count} selesai</span>
              </motion.div>
            )}

            {/* Rank 3 (Bronze) */}
            {homegroupStandings[2] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-3 border-2 border-amber-700/30 shadow-soft flex flex-col justify-between order-3"
              >
                <div className="text-xl">🥉</div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">{homegroupStandings[2].name}</div>
                <div className="text-xs font-extrabold text-slate-900 mt-1">{homegroupStandings[2].totalScore} pts</div>
                <span className="text-[10px] text-slate-500">{homegroupStandings[2].count} selesai</span>
              </motion.div>
            )}
          </div>

          {/* Full 16 Homegroup List */}
          <Card variant="glass" className="p-3 border border-amber-200 divide-y divide-amber-100">
            {homegroupStandings.map((group, idx) => (
              <div
                key={group.name}
                className="py-2.5 flex items-center justify-between text-xs px-2 hover:bg-amber-50/50 rounded-xl transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">{group.name}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {group.count} peserta selesai • rata-rata: {group.avgScore} pts
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-amber-950 text-sm">{group.totalScore}</span>
                  <span className="text-[10px] text-slate-500 block">poin total</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* TAB 2: INDIVIDUAL TOP CONNECTORS */}
      {activeTab === 'individual' && (
        <div className="space-y-3">
          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isIndo ? 'Cari nama peserta...' : 'Search participant name...'}
                className="w-full pl-8 pr-3 py-2 rounded-2xl bg-white border border-amber-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Homegroup Dropdown Filter */}
            <div>
              <select
                value={selectedHomegroupFilter}
                onChange={(e) => setSelectedHomegroupFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-white border border-amber-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              >
                <option value="ALL">{isIndo ? 'Semua 16 Homegroup' : 'All 16 Homegroups'}</option>
                {HOMEGROUP_OPTIONS.map((hg) => (
                  <option key={hg} value={hg}>
                    {hg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Individual Leaderboard List */}
          <Card variant="glass" className="p-3 border border-amber-200 divide-y divide-amber-100">
            {filteredIndividuals.map((p, idx) => (
              <div
                key={p.id}
                className={`py-3 px-2 flex items-center justify-between rounded-2xl transition ${
                  p.isCurrentUser
                    ? 'bg-amber-100/80 border border-amber-300 shadow-xs'
                    : 'hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    <AvatarSprite avatarId={p.avatarId} className="w-8 h-8" animated={false} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-800">{p.name}</span>
                      {p.isCurrentUser && (
                        <span className="text-[9px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full">
                          {isIndo ? 'Kamu' : 'You'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <span>{p.homegroup}</span>
                      <span>•</span>
                      <span className="text-amber-800 font-semibold">{p.archetype}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-amber-950">{p.totalScore}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{p.timeAgo}</div>
                </div>
              </div>
            ))}

            {filteredIndividuals.length === 0 && allIndividuals.length > 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                {isIndo
                  ? 'Tidak ada peserta yang cocok dengan filter atau pencarian.'
                  : 'No participants match your search or filter.'}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Database Config Modal - strictly protected for Admin/Developer only */}
      {isAdmin && (
        <DatabaseConfigModal
          isOpen={showDbModal}
          onClose={() => setShowDbModal(false)}
          onConfigSaved={loadData}
        />
      )}

      {/* Scoring Formula Info Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isIndo ? 'Cara Perhitungan Poin Leaderboard' : 'Scoring System Breakdown'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isIndo
                ? 'Skor Leaderboard (Total Maksimal 1.000 Poin) dihitung secara seimbang dari 4 pilar Capacity Building:'
                : 'The 1,000-point total score is calculated across 4 Capacity Building pillars:'}
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-0.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isIndo ? '1. ⏱️ Kecepatan & Fokus (Maks. 250 Poin)' : '1. ⏱️ Speed & Focus (Max 250 Points)'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isIndo
                    ? 'Dihitung dari kecepatan dan ketepatan menyelesaikan misi visual novel tanpa menunda.'
                    : 'Calculated from completion speed and focus throughout the story quest.'}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-0.5">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isIndo ? '2. ⭐ Performa Arcade Mini-Games (Maks. 350 Poin)' : '2. ⭐ Arcade Mini-Game Mastery (Max 350 Points)'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isIndo
                    ? 'Hasil tangkapan bintang Starfall Catcher & efisiensi rotasi puzzle Lantern Bridge.'
                    : 'Starfall Catcher high-score mastery & Lantern Bridge circuit rotation efficiency.'}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isIndo ? '3. 🌿 Keseimbangan Indikator Koneksi (Maks. 250 Poin)' : '3. 🌿 Connection Indicator Balance (Max 250 Points)'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isIndo
                    ? 'Bobot kebijaksanaan dalam Inisiatif, Empati, Adaptabilitas, dan Autentisitas.'
                    : 'Balanced wisdom across Initiative, Empathy, Adaptability, and Authenticity.'}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-0.5">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isIndo ? '4. 🎯 Kualitas Komitmen CTA 48 Jam (Maks. 150 Poin)' : '4. 🎯 48-Hour CTA Pledge Quality (Max 150 Points)'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isIndo
                    ? 'Kedalaman janji aksi konkret, pemilihan strategi, dan target lingkungan nyata.'
                    : 'Actionable commitment depth, chosen strategy, and real-world environment target.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs cursor-pointer shadow-xs"
            >
              {isIndo ? 'Saya Mengerti' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
