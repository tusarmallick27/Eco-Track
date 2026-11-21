import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  badge?: string;
  trend?: string;
  gradient: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  trend,
  gradient
}) => {
  return (
    <div className="relative p-5 rounded-3xl glass-card border border-emerald-500/20 overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {subtext && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        )}
      </div>

      {(badge || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between text-[10px]">
          {trend && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑</span> {trend}
            </span>
          )}
          {badge && (
            <span className="font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
