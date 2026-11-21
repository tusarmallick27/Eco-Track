import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Globe2, Recycle, Trees, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeroSectionProps {
  onStartTracking: () => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTracking, onExploreFeatures }) => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/20 via-lime-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-emerald-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm hover:scale-105 transition-transform cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Next-Gen Circular Economy Platform</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Powered by Gemini AI</span>
          </div>
        </div>

        {/* Main Heading & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Make Every Action Count for a{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-300 bg-clip-text text-transparent">
              Greener Planet.
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            EcoTrack empowers you to monitor waste, identify recyclable materials in seconds with computer vision, locate certified eco facilities, and turn sustainable daily habits into rewarding eco points.
          </p>
        </div>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartTracking}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <span>{isAuthenticated ? 'Open My Dashboard' : 'Start Tracking Free'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore Features</span>
          </button>
        </div>

        {/* Hero Illustration & Floating Cards */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Main Visual Display */}
          <div className="rounded-3xl glass-card p-3 sm:p-5 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gradient-to-b from-slate-900 to-[#061710] flex items-center justify-center border border-emerald-500/10">
              
              {/* Environmental Graphic & Simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent opacity-80" />
              
              <div className="relative z-10 text-center px-4">
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center mb-4 shadow-2xl shadow-emerald-500/30 animate-pulse-slow">
                  <Globe2 className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-400 animate-spin" style={{ animationDuration: '30s' }} />
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2">
                  Zero Waste Intelligence System
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300/90 max-w-md mx-auto">
                  142,500+ kg waste logged & 84% diverted from landfills worldwide.
                </p>
              </div>

              {/* Grid overlay lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e0a_1px,transparent_1px),linear-gradient(to_bottom,#22c55e0a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            </div>

            {/* Floating Glassmorphism Badge 1 (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:top-8 sm:-left-8 glass-panel p-3.5 rounded-2xl border border-emerald-500/30 shadow-xl flex items-center gap-3 animate-float hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">AI Material Scan</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">PET #1 Bottle (98% Recyclable)</p>
              </div>
            </div>

            {/* Floating Glassmorphism Badge 2 (Bottom Right) */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-8 glass-panel p-3.5 rounded-2xl border border-emerald-500/30 shadow-xl flex items-center gap-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Weekly Streak</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">+250 Eco Points Unlocked!</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
