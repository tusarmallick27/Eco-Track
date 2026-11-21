import React from 'react';
import { Scale, Recycle, Trees, Users2 } from 'lucide-react';

export const StatsTicker: React.FC = () => {
  const stats = [
    {
      label: 'Waste Monitored & Tracked',
      value: '142,500+ kg',
      subtext: 'Across 48,000+ logged household activities',
      icon: Scale,
    },
    {
      label: 'Landfill Diversion Rate',
      value: '84.2%',
      subtext: 'Directly diverted to recycling & composting',
      icon: Recycle,
    },
    {
      label: 'Equivalent Trees Preserved',
      value: '28,400+',
      subtext: 'Calculated via EPA WARM CO2 sequestration',
      icon: Trees,
    },
    {
      label: 'Active Community Stewards',
      value: '12,850+',
      subtext: 'Leading zero-waste households & groups',
      icon: Users2,
    },
  ];

  return (
    <div className="py-12 border-y border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </h4>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
