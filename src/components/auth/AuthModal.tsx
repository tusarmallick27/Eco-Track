import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = 'signin' | 'signup' | 'forgot' | 'demo';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, resetPassword, loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.error || 'Failed to sign in. Please check your credentials.');
        }
      } else if (activeTab === 'signup') {
        const res = await register(name, email, password);
        if (res.success) {
          setSuccessMessage('Account created successfully! Welcome to EcoTrack.');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else if (activeTab === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage(res.message);
        } else {
          setError(res.message);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      loginAsDemoAdmin();
    } else {
      loginAsDemoUser();
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 text-slate-800 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 text-white shadow-lg shadow-emerald-500/30 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {activeTab === 'signin' && 'Welcome Back to EcoTrack'}
            {activeTab === 'signup' && 'Join the Eco Movement'}
            {activeTab === 'forgot' && 'Reset Your Password'}
            {activeTab === 'demo' && 'Instant Demo Access'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'signin' && 'Enter your credentials to continue tracking your impact.'}
            {activeTab === 'signup' && 'Create your account to start tracking waste and earning eco points.'}
            {activeTab === 'forgot' && 'We will send you a secure link to recover your account.'}
            {activeTab === 'demo' && 'Explore all features right away with pre-configured accounts.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-emerald-950/50 p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-emerald-800/80 text-emerald-700 dark:text-emerald-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-emerald-800/80 text-emerald-700 dark:text-emerald-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('demo'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700'
            }`}
          >
            ⚡ Demo
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Content */}
        {activeTab !== 'demo' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Green"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {activeTab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {activeTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {activeTab === 'signin' && 'Sign In to Dashboard'}
                    {activeTab === 'signup' && 'Create Account'}
                    {activeTab === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {activeTab === 'forgot' && (
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="w-full text-center text-xs text-slate-500 hover:text-emerald-600 mt-2"
              >
                Back to Sign In
              </button>
            )}

            {!isSupabaseConfigured && (
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-emerald-950">
                ⚡ Supabase env keys not detected. Form will authenticate instantly via Demo Store.
              </p>
            )}

          </form>
        ) : (
          /* Instant Demo Access Tab */
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold mb-1">Judge & Evaluator Quick Mode</p>
              <p className="text-[11px] text-slate-600 dark:text-emerald-400/80 leading-relaxed">
                Skip registration and test the entire platform with one click using authentic pre-seeded data.
              </p>
            </div>

            <button
              onClick={() => handleDemoSelect('user')}
              className="w-full p-4 rounded-2xl glass-panel hover:border-emerald-500/50 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                  alt="Alex Green"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Alex Green</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Regular User
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    1,420 Eco Points · Level 4 Green Guardian
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleDemoSelect('admin')}
              className="w-full p-4 rounded-2xl glass-panel hover:border-amber-500/50 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                  alt="Sarah Vance"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Sarah Vance</span>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      Administrator
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Full Admin Portal Access · Center & Challenge Moderation
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
