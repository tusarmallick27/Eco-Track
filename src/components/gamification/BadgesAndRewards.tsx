import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getUserLevelInfo } from '../../lib/impactCalculator';

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  ShieldCheck,
  FileText,
  Sparkles,
  Flame,
  Trophy,
};

export const BadgesAndRewards: React.FC = () => {
  const { user } = useAuth();
  const { achievements, userAchievements, transactions } = useData();

  const levelInfo = getUserLevelInfo(user?.eco_points || 0);

  const unlockedMap = userAchievements.reduce((acc, ua) => {
    acc[ua.achievement_id] = ua;
    return acc;
  }, {} as Record<string, typeof userAchievements[0]>);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Tier & Points Overview */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Tier Progression
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>Level {levelInfo.level} · {levelInfo.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              Earn eco points by sorting packaging properly, logging daily waste diversion, and completing sustainable community sprints.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400">Total Verified Balance</span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {user?.eco_points || 0} <span className="text-xs font-normal">pts</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-emerald-950/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Progress to Next Level
            </span>
            <span className="font-bold text-emerald-500 font-mono">
              {user?.eco_points || 0} / {levelInfo.nextLevelPoints} pts ({levelInfo.progress}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-emerald-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements & Badges Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Milestone Badges & Honors
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete circular challenges and continuous recycling streaks to unlock badges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const Icon = ICON_MAP[ach.icon] || Award;
            const isUnlocked = Boolean(unlockedMap[ach.id]);

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl glass-card border transition-all duration-300 relative overflow-hidden ${
                  isUnlocked
                    ? 'border-emerald-500/40 bg-emerald-500/[0.02]'
                    : 'border-slate-200 dark:border-emerald-950/40 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-emerald-600 to-lime-500'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Reward</span>
                  <span className="font-bold text-amber-500 font-mono">
                    +{ach.points} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Transactions History */}
      <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Points Ledger & Activity History
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Real-time record of all verified eco points earned on your account.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-emerald-950/60">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(tx.created_at).toLocaleDateString()} · {tx.transaction_type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                +{tx.amount} pts
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
