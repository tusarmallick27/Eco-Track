import React from 'react';
import { Camera, CheckSquare, MapPinned, Trophy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Scan or Log Your Item',
      description: 'Snap a picture using the AI Waste Scanner or manually input packaging type, weight, and disposal method.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Get Immediate Sorting Guidance',
      description: 'Understand exactly if an item is recyclable, required cleaning steps, and proper bin color in your jurisdiction.',
      icon: CheckSquare,
    },
    {
      step: '03',
      title: 'Locate Certified Facilities',
      description: 'Find specialized drop-off points for hazardous waste, lithium batteries, glass, and electronic scrap on our map.',
      icon: MapPinned,
    },
    {
      step: '04',
      title: 'Earn Points & Level Up',
      description: 'Receive verified Eco Points for every kilogram diverted. Unlock badges, join community challenges, and climb the leaderboard.',
      icon: Trophy,
    },
  ];

  return (
    <section className="py-20 bg-slate-100/50 dark:bg-emerald-950/10 border-t border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How EcoTrack Works in 4 Steps
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            Transitioning from confusion to certified zero-waste habits takes less than 30 seconds a day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative p-6 rounded-3xl glass-card flex flex-col items-start border border-emerald-500/20 group hover:border-emerald-500/50 transition-all">
                <span className="text-4xl font-black text-emerald-500/20 dark:text-emerald-500/10 mb-4 select-none font-mono">
                  {item.step}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
