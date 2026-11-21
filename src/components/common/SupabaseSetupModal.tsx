import React, { useState } from 'react';
import { X, Database, Check, Copy, Key, ShieldCheck, Terminal, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseStatus } from '../../lib/supabase';
import { getStoredGeminiKey, saveGeminiKey } from '../../lib/gemini';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getStoredGeminiKey());
  const [geminiSaved, setGeminiSaved] = useState(false);

  if (!isOpen) return null;

  const status = getSupabaseStatus();

  const handleCopySql = () => {
    const sql = `-- EcoTrack Supabase SQL Schema (10 Tables + RLS)
-- Run in Supabase SQL Editor:
-- Tables: profiles, waste_records, waste_analyses, recycling_centers, eco_points_transactions, challenges, user_challenges, achievements, user_achievements, chatbot_conversations
-- Full schema located in project file: supabase/schema.sql`;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeminiKey(geminiKeyInput);
    setGeminiSaved(true);
    setTimeout(() => setGeminiSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Backend & AI Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supabase PostgreSQL configuration, Row Level Security (RLS) & Google Gemini AI API
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Supabase Connection</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                status.isConfigured 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}>
                {status.isConfigured ? 'Connected (Live Supabase)' : 'Demo Store Active'}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
              {status.url}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gemini AI Vision & EcoBot</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                geminiKeyInput 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {geminiKeyInput ? 'Live Gemini 1.5 Flash' : 'Built-in Vision Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {geminiKeyInput ? 'Personal API Key Active' : 'Offline Environmental Engine'}
            </p>
          </div>
        </div>

        {/* Gemini API Key Direct Input */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Google Gemini API Key (Optional)
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            To test real-time multimodal image classification and live conversational responses from Google Gemini 1.5 Flash, enter your API key here. (Stored only in your local browser storage).
          </p>
          <form onSubmit={handleSaveGeminiKey} className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              {geminiSaved ? 'Saved!' : 'Save Key'}
            </button>
          </form>
        </div>

        {/* Supabase Schema Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                10-Table PostgreSQL Schema (`supabase/schema.sql`)
              </h4>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL Path'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1 overflow-x-auto">
            <p className="text-emerald-400"># Tables Included in EcoTrack:</p>
            <p>1. profiles (id, email, name, role, eco_points, level, is_public_on_leaderboard)</p>
            <p>2. waste_records (user_id, category, quantity, unit, quantity_kg, disposal_method, eco_points_earned)</p>
            <p>3. waste_analyses (image_url, material_identified, category, recyclability, confidence)</p>
            <p>4. recycling_centers (name, address, city, latitude, longitude, accepted_materials)</p>
            <p>5. eco_points_transactions (user_id, amount, transaction_type, description)</p>
            <p>6. challenges (title, category, difficulty, duration_days, points_reward)</p>
            <p>7. user_challenges (user_id, challenge_id, status, current_progress)</p>
            <p>8. achievements (code, title, description, points, category)</p>
            <p>9. user_achievements (user_id, achievement_id, unlocked_at)</p>
            <p>10. chatbot_conversations (user_id, role, content, timestamp)</p>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p><strong>Environment Variables:</strong></p>
            <p className="font-mono bg-slate-100 dark:bg-emerald-950/60 p-2 rounded-lg">
              VITE_SUPABASE_URL=https://your-project.supabase.co<br />
              VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...<br />
              VITE_GEMINI_API_KEY=AIzaSy...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
