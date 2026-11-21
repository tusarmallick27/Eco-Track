import React, { useState } from 'react';
import { 
  Flame, 
  CheckCircle, 
  Clock, 
  Award, 
  Users, 
  Plus, 
  Sparkles, 
  Layers, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Challenge } from '../../types';

export const ChallengesPage: React.FC = () => {
  const { challenges, userChallenges, joinChallenge, incrementChallengeProgress } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const userChallengeMap = userChallenges.reduce((acc, uc) => {
    acc[uc.challenge_id] = uc;
    return acc;
  }, {} as Record<string, typeof userChallenges[0]>);

  const filteredChallenges = challenges.filter(c => {
    const uc = userChallengeMap[c.id];
    if (activeTab === 'active') {
      return uc && uc.status === 'active';
    }
    if (activeTab === 'completed') {
      return uc && uc.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Actionable Habit Sprints
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-7 h-7 text-amber-500" />
              <span>Eco Challenges</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Turn long-term sustainability into achievable daily sprints. Join challenges, track progress each day, and earn verified bonus eco points.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-emerald-950/50 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({challenges.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active ({userChallenges.filter(u => u.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'completed'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed ({userChallenges.filter(u => u.status === 'completed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => {
          const userState = userChallengeMap[challenge.id];
          const isJoined = Boolean(userState);
          const isCompleted = userState?.status === 'completed';
          const progress = userState ? Math.min(100, Math.round((userState.current_progress / userState.target_progress) * 100)) : 0;

          return (
            <div
              key={challenge.id}
              className={`p-6 rounded-3xl glass-card border transition-all duration-300 flex flex-col justify-between ${
                isCompleted 
                  ? 'border-emerald-500/50 bg-emerald-500/[0.03]' 
                  : isJoined 
                  ? 'border-amber-500/40' 
                  : 'border-emerald-500/20 hover:border-emerald-500/40'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {challenge.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                    <Award className="w-3.5 h-3.5" />
                    <span>+{challenge.points_reward} pts</span>
                  </div>
                </div>

                {/* Challenge Title & Description */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {challenge.description}
                </p>

                {/* Meta details */}
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{challenge.duration_days} Days</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{challenge.participants_count} Joined</span>
                  </span>
                  <span className="text-emerald-500 font-semibold">
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/60">
                {isCompleted ? (
                  <div className="flex items-center justify-between py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Challenge Completed!</span>
                    </span>
                    <span>+{challenge.points_reward} pts Claimed</span>
                  </div>
                ) : isJoined ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">
                        Day {userState.current_progress} of {userState.target_progress}
                      </span>
                      <span className="text-emerald-500 font-mono">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button
                      onClick={() => incrementChallengeProgress(challenge.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Today's Activity Complete</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => joinChallenge(challenge.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 glass-panel hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Join This Challenge</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
