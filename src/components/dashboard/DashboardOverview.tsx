import React from 'react';
import { 
  Scale, 
  Recycle, 
  Trash, 
  Award, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  MapPin, 
  Bot, 
  Trees, 
  Droplets, 
  Zap, 
  Calendar,
  Layers,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MetricCard } from './MetricCard';
import { getUserLevelInfo } from '../../lib/impactCalculator';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddWasteModal: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Plastic': '#10b981',
  'Paper': '#3b82f6',
  'Glass': '#06b6d4',
  'Metal': '#f59e0b',
  'Electronic waste': '#8b5cf6',
  'Organic waste': '#84cc16',
  'Other': '#64748b'
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenAddWasteModal
}) => {
  const { user } = useAuth();
  const { wasteRecords, impactSummary, userChallenges, challenges } = useData();

  const levelInfo = getUserLevelInfo(user?.eco_points || 0);

  // Prepare Category Breakdown Data for Pie Chart
  const categoryMap = wasteRecords.reduce((acc, rec) => {
    acc[rec.category] = (acc[rec.category] || 0) + (rec.quantity_kg || 0);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(1))
  }));

  // Prepare Weekly Activity Chart Data (last 7 days simulation/data)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day, i) => {
    const isToday = i === 5; // e.g. Saturday
    const seed = (i + 1) * 0.8;
    return {
      day,
      recycled: Number((seed * 1.8 + (isToday ? 2.4 : 0.8)).toFixed(1)),
      landfill: Number((seed * 0.3).toFixed(1))
    };
  });

  const activeChallenges = userChallenges
    .filter(uc => uc.status === 'active')
    .slice(0, 2)
    .map(uc => {
      const challengeInfo = challenges.find(c => c.id === uc.challenge_id);
      return { ...uc, challengeInfo };
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / Welcome */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-lime-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                🌿 Level {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {user?.location || 'Zero-Waste Community'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Eco Steward'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              You have successfully diverted <span className="font-bold text-emerald-600 dark:text-emerald-400">{impactSummary.landfill_diverted_kg} kg</span> of waste from landfills, saving approximately <span className="font-bold text-emerald-600 dark:text-emerald-400">{impactSummary.co2_saved_kg} kg</span> of CO2e!
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenAddWasteModal}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Waste Record</span>
            </button>

            <button
              onClick={() => onNavigateTab('ai-identifier')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold glass-panel text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Scan Item (AI)</span>
            </button>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-emerald-950/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Next Tier: Level {levelInfo.level + 1}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {user?.eco_points || 0} / {levelInfo.nextLevelPoints} pts ({levelInfo.progress}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-emerald-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Waste Tracked"
          value={`${impactSummary.total_waste_kg} kg`}
          subtext={`${wasteRecords.length} recorded items`}
          icon={Scale}
          trend="+12% this month"
          gradient="from-emerald-600 to-teal-500"
        />
        <MetricCard
          title="Recycled & Diverted"
          value={`${impactSummary.landfill_diverted_kg} kg`}
          subtext={`${impactSummary.diversion_rate_percentage}% diversion rate`}
          icon={Recycle}
          badge="High Efficiency"
          gradient="from-emerald-500 to-lime-400"
        />
        <MetricCard
          title="Landfill Disposed"
          value={`${(impactSummary.total_waste_kg - impactSummary.landfill_diverted_kg).toFixed(1)} kg`}
          subtext="Unrecycled packaging"
          icon={Trash}
          badge="Target < 20%"
          gradient="from-slate-600 to-slate-800"
        />
        <MetricCard
          title="Eco Points Earned"
          value={user?.eco_points || 0}
          subtext="Verified circular rewards"
          icon={Award}
          trend="Level 4 Guardian"
          gradient="from-amber-500 to-lime-500"
        />
      </div>

      {/* Environmental Impact Summary Equivalencies */}
      <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trees className="w-4 h-4 text-emerald-500" />
          <span>Real-World Ecological Savings (EPA WARM Methodology)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Carbon Offset</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {impactSummary.co2_saved_kg} kg CO2e
              </h4>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                ≈ {impactSummary.trees_equivalent} trees yearly absorption
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Water Preserved</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {impactSummary.water_saved_liters} Liters
              </h4>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400">
                Preserved from industrial pulping
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/30 border border-amber-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Energy Conserved</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {impactSummary.energy_saved_kwh} kWh
              </h4>
              <p className="text-[10px] text-amber-600 dark:text-amber-400">
                Avoided virgin fossil fuel refining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section: Weekly Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Weekly Progress Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-emerald-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Waste vs Recycled
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily volume comparison (kg)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                Recycled / Composted
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-slate-400 inline-block" />
                Landfill
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a2318', 
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="recycled" fill="#22c55e" radius={[4, 4, 0, 0]} name="Recycled (kg)" />
                <Bar dataKey="landfill" fill="#64748b" radius={[4, 4, 0, 0]} name="Landfill (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Pie/Donut Chart */}
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Breakdown by material type
            </p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || '#64748b'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a2318', 
                      borderColor: 'rgba(34, 197, 94, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {pieData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#64748b' }}
                  />
                  {entry.name}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {entry.value} kg
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Activity Feed & Active Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Logged Activities */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Waste Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest database records logged by your account
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-emerald-950/60">
            {wasteRecords.slice(0, 5).map((rec) => (
              <div key={rec.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: CATEGORY_COLORS[rec.category] || '#64748b' }}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.description}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{rec.category}</span>
                      <span>•</span>
                      <span>{rec.date}</span>
                      <span>•</span>
                      <span className={`font-semibold ${rec.disposal_method === 'Landfill' ? 'text-slate-400' : 'text-emerald-500'}`}>
                        {rec.disposal_method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {rec.quantity} {rec.unit}
                  </p>
                  {rec.eco_points_earned > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      +{rec.eco_points_earned} pts
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">0 pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Active Challenges */}
        <div className="space-y-6">
          
          {/* Active Challenge Preview */}
          <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Active Challenge</span>
              </h3>
              <button
                onClick={() => onNavigateTab('challenges')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Browse All
              </button>
            </div>

            {activeChallenges.length > 0 ? (
              activeChallenges.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/40 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.challengeInfo?.title}
                    </h5>
                    <span className="text-[10px] font-bold text-amber-500">
                      +{item.challengeInfo?.points_reward} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    {item.challengeInfo?.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span>{item.current_progress} / {item.target_progress} Days</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-emerald-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round((item.current_progress / item.target_progress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No active challenges. Join one today!</p>
            )}
          </div>

          {/* Quick Hub Navigation */}
          <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
              Quick Shortcuts
            </h4>
            <button
              onClick={() => onNavigateTab('map')}
              className="w-full p-3 rounded-xl glass-panel hover:border-emerald-500/40 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Find Nearby Recycling Centers
              </span>
              <span>→</span>
            </button>
            <button
              onClick={() => onNavigateTab('ecobot')}
              className="w-full p-3 rounded-xl glass-panel hover:border-emerald-500/40 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-500" />
                Ask EcoBot Sorting Questions
              </span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
