import React, { useState } from 'react';
import { Trophy, Award, Medal, Eye, EyeOff, ShieldCheck, Flame, Scale, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LocalStore } from '../../lib/storage';
import { LeaderboardEntry } from '../../types';

export const LeaderboardPage: React.FC = () => {
  const { user, toggleLeaderboardPrivacy } = useAuth();
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const leaderboard = LocalStore.getLeaderboard();

  // If user has opted out of public leaderboard, don't show user to public or show privacy alert
  const isPublic = user?.is_public_on_leaderboard !== false;

  const displayList = leaderboard.filter(entry => {
    if (searchQuery.trim()) {
      return entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Community Rankings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>Eco Leaderboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              Recognizing dedicated individuals leading their households and neighborhoods toward zero-waste living.
            </p>
          </div>

          {/* Privacy Toggle */}
          <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/20 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Eye className="w-4 h-4 text-emerald-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Profile Visibility</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isPublic ? 'Visible to community' : 'Hidden from public rank'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleLeaderboardPrivacy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPublic
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isPublic ? 'Public' : 'Private'}
            </button>
          </div>
        </div>

        {/* Timeframe Tabs & Search */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-emerald-950/50 p-1 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setTimeframe('all')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                timeframe === 'all'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                timeframe === 'monthly'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                timeframe === 'weekly'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        
        {/* Rank 2 (Silver) */}
        {leaderboard[1] && (
          <div className="p-6 rounded-3xl glass-card border border-slate-300 dark:border-slate-700/60 text-center relative order-2 md:order-1">
            <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md">
              #2
            </div>
            <img
              src={leaderboard[1].avatar_url}
              alt={leaderboard[1].name}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-slate-300/50 mb-3"
            />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{leaderboard[1].name}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{leaderboard[1].level_title}</p>
            <p className="text-lg font-black text-slate-700 dark:text-slate-200 font-mono mt-2">
              {leaderboard[1].eco_points} pts
            </p>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {leaderboard[0] && (
          <div className="p-8 rounded-3xl glass-card border-2 border-amber-400/60 text-center relative shadow-2xl shadow-amber-500/10 order-1 md:order-2 md:-translate-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-900 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-lg">
              👑 #1
            </div>
            <img
              src={leaderboard[0].avatar_url}
              alt={leaderboard[0].name}
              className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-400/60 mb-3"
            />
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{leaderboard[0].name}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
              {leaderboard[0].level_title}
            </span>
            <p className="text-2xl font-black text-amber-500 font-mono mt-3">
              {leaderboard[0].eco_points} pts
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{leaderboard[0].recycled_kg} kg Recycled</p>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {leaderboard[2] && (
          <div className="p-6 rounded-3xl glass-card border border-amber-700/40 text-center relative order-3">
            <div className="w-8 h-8 rounded-full bg-amber-700/30 text-amber-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md">
              #3
            </div>
            <img
              src={leaderboard[2].avatar_url}
              alt={leaderboard[2].name}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-amber-700/40 mb-3"
            />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{leaderboard[2].name}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{leaderboard[2].level_title}</p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono mt-2">
              {leaderboard[2].eco_points} pts
            </p>
          </div>
        )}

      </div>

      {/* Leaderboard Table List */}
      <div className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 dark:bg-emerald-950/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-emerald-950">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Community Member</th>
              <th className="px-6 py-4">Tier</th>
              <th className="px-6 py-4">Recycled</th>
              <th className="px-6 py-4">Badges</th>
              <th className="px-6 py-4 text-right">Eco Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/60 text-slate-700 dark:text-slate-300">
            {displayList.map((entry) => (
              <tr 
                key={entry.user_id} 
                className={`transition-colors ${
                  entry.is_current_user 
                    ? 'bg-emerald-500/10 font-bold border-l-4 border-l-emerald-500' 
                    : 'hover:bg-emerald-500/[0.03]'
                }`}
              >
                <td className="px-6 py-4 font-mono font-bold">
                  {entry.rank <= 3 ? `🎖️ #${entry.rank}` : `#${entry.rank}`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <span className="text-slate-900 dark:text-white">{entry.name}</span>
                      {entry.is_current_user && (
                        <span className="text-[10px] text-emerald-500 ml-1.5">(Your Profile)</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {entry.level_title}
                </td>
                <td className="px-6 py-4 font-mono">
                  {entry.recycled_kg} kg
                </td>
                <td className="px-6 py-4 font-mono">
                  {entry.badges_count}
                </td>
                <td className="px-6 py-4 text-right font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {entry.eco_points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
