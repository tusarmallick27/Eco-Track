import React, { useState } from 'react';
import { 
  Leaf, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  MapPin, 
  Trophy, 
  BarChart3, 
  Trash2, 
  Bot, 
  Database,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  openSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openSupabaseModal
}) => {
  const { user, isAuthenticated, isAdmin, isDemoMode, logout, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Leaf },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-identifier', label: 'AI Scanner', icon: Sparkles },
    { id: 'tracker', label: 'Waste Tracker', icon: Trash2 },
    { id: 'map', label: 'Recycle Map', icon: MapPin },
    { id: 'challenges', label: 'Challenges', icon: Flame },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ecobot', label: 'EcoBot', icon: Bot },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/10 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0a2318] dark:bg-[#07130e] rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-300 bg-clip-text text-transparent">
                  EcoTrack
                </span>
                {isDemoMode && (
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
                Track Waste. Save Earth.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Database / Supabase Info Icon */}
            <button
              onClick={openSupabaseModal}
              title="Database & Backend Architecture"
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {user.eco_points} pts
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-xl p-2 z-50 border border-emerald-500/20">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-emerald-900/40">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Lvl {user.level} · {user.level_title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[9px]">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentTab('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-500" />
                        My Eco Dashboard
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentTab('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Console
                        </button>
                      )}

                      {/* Demo Switcher Quick Buttons */}
                      <div className="pt-1 mt-1 border-t border-slate-100 dark:border-emerald-900/40">
                        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Demo Profiles
                        </p>
                        <button
                          onClick={() => {
                            loginAsDemoUser();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                        >
                          👤 Switch to Alex (User)
                        </button>
                        <button
                          onClick={() => {
                            loginAsDemoAdmin();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                        >
                          🛡️ Switch to Sarah (Admin)
                        </button>
                      </div>

                      <div className="pt-1 mt-1 border-t border-slate-100 dark:border-emerald-900/40">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-600/25 transition-all duration-200"
                >
                  Start Tracking
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-emerald-500/20 px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-500" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
