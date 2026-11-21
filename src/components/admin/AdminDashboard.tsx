import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Flame, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Activity, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { RecyclingCenter, WasteCategory, Challenge } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loginAsDemoAdmin } = useAuth();
  const { recyclingCenters, deleteRecyclingCenter, addRecyclingCenter, challenges, addChallenge, wasteRecords } = useData();

  const [activeTab, setActiveTab] = useState<'centers' | 'challenges' | 'users' | 'audit'>('centers');
  
  // Center creation form state
  const [centerName, setCenterName] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [centerCity, setCenterCity] = useState('');
  const [centerLat, setCenterLat] = useState('47.6062');
  const [centerLng, setCenterLng] = useState('-122.3321');
  const [centerHours, setCenterHours] = useState('Mon-Fri: 09:00 - 17:00');
  const [showCenterForm, setShowCenterForm] = useState(false);

  // Challenge creation form state
  const [chTitle, setChTitle] = useState('');
  const [chCategory, setChCategory] = useState<WasteCategory>('Plastic');
  const [chDesc, setChDesc] = useState('');
  const [chDuration, setChDuration] = useState('7');
  const [chPoints, setChPoints] = useState('200');
  const [chDifficulty, setChDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [showChallengeForm, setShowChallengeForm] = useState(false);

  // Guard for role-based security
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl glass-card border border-rose-500/30 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Administrator Access Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          You are currently signed in as a standard user ({user?.email || 'Guest'}). Administrator functions (user management, center moderation, challenge publishing) are protected by server-side role security.
        </p>
        <div className="pt-4">
          <button
            onClick={loginAsDemoAdmin}
            className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-600/25 inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Administrator Profile (Sarah Vance)</span>
          </button>
        </div>
      </div>
    );
  }

  const handleCreateCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName || !centerAddress || !centerCity) return;

    addRecyclingCenter({
      name: centerName,
      address: centerAddress,
      city: centerCity,
      latitude: parseFloat(centerLat) || 47.6062,
      longitude: parseFloat(centerLng) || -122.3321,
      phone: '+1 (555) 019-2831',
      hours: centerHours,
      accepted_materials: ['Plastic', 'Paper', 'Metal', 'Glass'],
      is_verified: true,
      is_demo: false,
    });

    setCenterName('');
    setCenterAddress('');
    setCenterCity('');
    setShowCenterForm(false);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle || !chDesc) return;

    addChallenge({
      title: chTitle,
      category: chCategory,
      description: chDesc,
      difficulty: chDifficulty,
      duration_days: parseInt(chDuration) || 7,
      points_reward: parseInt(chPoints) || 200,
      icon: 'Flame',
      target_goal: `${chDuration} Days Sprints`,
    });

    setChTitle('');
    setChDesc('');
    setShowChallengeForm(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console · Role: Administrator</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Oversee platform activity, manage registered recycling depots, publish sustainability challenges, and maintain database security.
            </p>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-emerald-950/50 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('centers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'centers'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recycling Centers ({recyclingCenters.length})
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'challenges'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Challenges ({challenges.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'users'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Users (8)
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Logs
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Recycling Center Moderation */}
      {activeTab === 'centers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recycling Center Directory Management
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Approve, edit, or append verified municipal and specialized recovery centers.
              </p>
            </div>
            <button
              onClick={() => setShowCenterForm(!showCenterForm)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{showCenterForm ? 'Cancel' : 'Add New Center'}</span>
            </button>
          </div>

          {showCenterForm && (
            <form onSubmit={handleCreateCenter} className="p-6 rounded-3xl glass-card border border-emerald-500/30 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Register New Facility
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Puget Sound Glass Recyclers"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Terrace"
                    value={centerAddress}
                    onChange={(e) => setCenterAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seattle"
                    value={centerCity}
                    onChange={(e) => setCenterCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={centerLat}
                    onChange={(e) => setCenterLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={centerLng}
                    onChange={(e) => setCenterLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={centerHours}
                    onChange={(e) => setCenterHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Save Facility to Database
              </button>
            </form>
          )}

          <div className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-emerald-950/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-emerald-950">
                <tr>
                  <th className="px-6 py-4">Facility</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/60 text-slate-700 dark:text-slate-300">
                {recyclingCenters.map(center => (
                  <tr key={center.id} className="hover:bg-emerald-500/[0.03]">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {center.name}
                      <p className="text-[10px] text-slate-400 font-normal">{center.address}</p>
                    </td>
                    <td className="px-6 py-4">{center.city}</td>
                    <td className="px-6 py-4 text-slate-400">{center.hours}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold">
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteRecyclingCenter(center.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10"
                        title="Delete Center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Challenges Management */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Community Challenges Publisher
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deploy new gamified habit sprints to inspire sustainable behavior.
              </p>
            </div>
            <button
              onClick={() => setShowChallengeForm(!showChallengeForm)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{showChallengeForm ? 'Cancel' : 'Create Challenge'}</span>
            </button>
          </div>

          {showChallengeForm && (
            <form onSubmit={handleCreateChallenge} className="p-6 rounded-3xl glass-card border border-amber-500/30 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Publish New Challenge
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Challenge Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zero-Waste Lunchbox Month"
                    value={chTitle}
                    onChange={(e) => setChTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Category</label>
                  <select
                    value={chCategory}
                    onChange={(e) => setChCategory(e.target.value as WasteCategory)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="Metal">Metal</option>
                    <option value="Organic waste">Organic waste</option>
                    <option value="Electronic waste">Electronic waste</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Description & Rules</label>
                <textarea
                  required
                  placeholder="Explain guidelines and how community members qualify..."
                  value={chDesc}
                  onChange={(e) => setChDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 h-20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={chDuration}
                    onChange={(e) => setChDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Eco Points Reward</label>
                  <input
                    type="number"
                    value={chPoints}
                    onChange={(e) => setChPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Difficulty</label>
                  <select
                    value={chDifficulty}
                    onChange={(e) => setChDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white"
              >
                Publish Challenge to Community
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenges.map(c => (
              <div key={c.id} className="p-5 rounded-2xl glass-card border border-emerald-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 font-mono">
                      +{c.points_reward} pts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{c.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-emerald-950/60 text-[10px] text-slate-400 flex justify-between">
                  <span>{c.duration_days} Days Sprint</span>
                  <span>{c.participants_count} Participants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="rounded-3xl glass-card border border-emerald-500/20 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            User Accounts & Role Permissions
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-emerald-950/60 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Sarah Vance (Current Admin)</p>
                <p className="text-[11px] text-slate-500">admin.sarah@ecotrack.org · Level 5 Planet Protector</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">
                Administrator
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Alex Green</p>
                <p className="text-[11px] text-slate-500">alex.green@example.com · Level 4 Green Guardian</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase">
                User
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Elena Rostova</p>
                <p className="text-[11px] text-slate-500">elena.r@example.org · Level 6 Earth Champion</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase">
                User
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl glass-card border border-emerald-500/20 p-6 space-y-3 font-mono text-[11px]">
          <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white mb-2">
            System & RLS Security Audit Trail
          </h3>
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 space-y-1.5 overflow-x-auto">
            <p className="text-emerald-400">[SECURITY-AUDIT] Row Level Security (RLS) policies ACTIVE on 10 tables.</p>
            <p className="text-slate-400">[AUTH-SESSION] Current user validated with role: administrator.</p>
            <p className="text-slate-400">[WASTE-LOG] 7 verified entries stored in PostgreSQL instance.</p>
            <p className="text-slate-400">[AI-ENGINE] Multimodal vision neural weights loaded & ready.</p>
            <p className="text-emerald-400">[MAPS-API] OpenStreetMap tiles initialized with 6 active regional recovery nodes.</p>
          </div>
        </div>
      )}

    </div>
  );
};
