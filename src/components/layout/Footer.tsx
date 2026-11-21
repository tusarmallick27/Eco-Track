import React from 'react';
import { Leaf, Heart, Globe, Shield, Sparkles, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openSupabaseModal }) => {
  return (
    <footer className="border-t border-emerald-500/10 bg-slate-900/95 dark:bg-[#040d0a] text-slate-300 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0a2318] rounded-[10px] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                EcoTrack
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track Waste. Save Earth. Inspire Change. An intelligent sustainability platform empowering households, organizations, and communities to achieve zero-waste milestones.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Certified EPA WARM Metric Calculations</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-emerald-300 transition-colors">
                  Personal Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('ai-identifier')} className="hover:text-emerald-300 transition-colors">
                  AI Waste Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('tracker')} className="hover:text-emerald-300 transition-colors">
                  Interactive Waste Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('map')} className="hover:text-emerald-300 transition-colors">
                  Recycling Center Locator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('challenges')} className="hover:text-emerald-300 transition-colors">
                  Sustainability Challenges
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Resources & Tech
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('analytics')} className="hover:text-emerald-300 transition-colors">
                  Carbon & Impact Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('ecobot')} className="hover:text-emerald-300 transition-colors">
                  EcoBot AI Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('leaderboard')} className="hover:text-emerald-300 transition-colors">
                  Community Leaderboard
                </button>
              </li>
              <li>
                <button onClick={openSupabaseModal} className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors text-emerald-400 font-semibold">
                  <span>Supabase Database Schema</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Eco Updates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400">
              Get weekly zero-waste micro-habits and circular economy tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                onClick={() => alert('Thank you for subscribing to EcoTrack weekly sustainability insights!')}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Zero spam. Unsubscribe at any time.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EcoTrack Platform. Built for the Earth.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for global sustainability
            </span>
            <button onClick={openSupabaseModal} className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security & RLS</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
