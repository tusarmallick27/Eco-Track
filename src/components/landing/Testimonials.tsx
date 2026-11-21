import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Maya Lindqvist',
      role: 'Environmental Sciences Student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      content: 'The AI Scanner is unbelievable. It detected that my coffee cup had an invisible polyethylene lining and guided me to specialized drop-off instead of contaminating my blue bin!',
      badge: 'Verified Demo Reviewer',
      rating: 5,
    },
    {
      name: 'Dr. David Ramirez',
      role: 'Municipal Sustainability Officer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
      content: 'EcoTrack makes community gamification effortless. Our neighborhood diversion rate jumped from 42% to 68% after adopting the weekly recycling challenges.',
      badge: 'Verified Community Lead',
      rating: 5,
    },
    {
      name: 'Claire Zhang',
      role: 'Zero-Waste Household Parent',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      content: 'My kids love competing on the leaderboard for eco badges! We have reduced our household landfill bin output to a single small grocery bag per month.',
      badge: 'Level 5 Planet Protector',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-100/50 dark:bg-emerald-950/10 border-t border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            Demo & Community Feedback
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Eco Stewards Everywhere
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Sample user experiences representing typical household and municipal deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl glass-card border border-emerald-500/20 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-emerald-950/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    {t.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
