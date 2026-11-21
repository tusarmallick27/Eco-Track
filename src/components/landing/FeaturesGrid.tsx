import React from 'react';
import { Sparkles, Trash2, MapPin, Award, Bot, BarChart3, ShieldCheck, Flame } from 'lucide-react';

interface FeaturesGridProps {
  onSelectFeature: (tabId: string) => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'ai-identifier',
      icon: Sparkles,
      title: 'AI Smart Waste Identifier',
      description: 'Upload or snap a photo of any item. Our computer vision neural network recognizes resin codes, material composition, and exact bin segregation steps.',
      badge: 'Multimodal AI',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'tracker',
      icon: Trash2,
      title: 'Precision Waste Tracker',
      description: 'Log plastics, metals, paper, e-waste, and organics. Track units, weights, disposal methods (recycled, composted, landfill) with full history.',
      badge: 'Interactive CRUD',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      id: 'map',
      icon: MapPin,
      title: 'Recycling Center Locator',
      description: 'Interactive OpenStreetMap discovery for specialized municipal depots, electronics recyclers, and organics collection with live directions.',
      badge: 'OpenStreetMap',
      color: 'from-emerald-600 to-lime-500'
    },
    {
      id: 'challenges',
      icon: Flame,
      title: 'Eco Challenges & Streaks',
      description: 'Engage in plastic-free sprints, 7-day paper recycling streaks, and community clean-up missions to build lasting sustainable habits.',
      badge: 'Gamification',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'leaderboard',
      icon: Award,
      title: 'Community Leaderboard',
      description: 'Compete with friends, neighbors, and coworkers for top spots. Earn verified badges from "Seedling" to "Earth Champion".',
      badge: 'Social Impact',
      color: 'from-lime-500 to-emerald-500'
    },
    {
      id: 'ecobot',
      icon: Bot,
      title: 'EcoBot AI Assistant',
      description: 'Your 24/7 environmental advisor. Ask anything about tricky packaging materials, composting ratios, or hazardous battery disposal.',
      badge: 'Generative AI',
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Impact Analytics & PDF Audits',
      description: 'Visualize CO2 avoided, water conserved, and landfill space saved with EPA WARM methodology. Download formal CSV and PDF reports.',
      badge: 'Certified Math',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'admin',
      icon: ShieldCheck,
      title: 'Enterprise & Admin Portal',
      description: 'Manage users, verify new community recycling facilities, launch city-wide challenges, and oversee platform activity with RLS permissions.',
      badge: 'Role Security',
      color: 'from-emerald-600 to-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Engineered For Impact
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need To Build A Zero-Waste Life
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            From computer vision material classification to verified carbon offset metrics, EcoTrack bridges personal choices with planetary impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                className="group relative p-6 rounded-3xl glass-card hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {feature.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Launch Feature</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
