import React, { useState } from 'react';
import { Sparkles, ShieldCheck, User, Database, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DemoBannerProps {
  openSupabaseModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ openSupabaseModal, setCurrentTab }) => {
  const { isDemoMode, isAdmin, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode || dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-950 text-emerald-200 border-b border-emerald-500/20 text-xs py-2 px-4 shadow-inner transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">
            Demo & Hackathon Mode:
          </span>
          <span className="text-emerald-300 hidden md:inline">
            Zero-friction evaluation active. Real AI integration and Supabase backend ready.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { loginAsDemoUser(); setCurrentTab('dashboard'); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
              !isAdmin ? 'bg-emerald-500 text-white shadow-sm' : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Normal User (Alex)</span>
          </button>

          <button
            onClick={() => { loginAsDemoAdmin(); setCurrentTab('admin'); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
              isAdmin ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin (Sarah)</span>
          </button>

          <button
            onClick={openSupabaseModal}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Database SQL</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 ml-1"
            title="Dismiss demo banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
