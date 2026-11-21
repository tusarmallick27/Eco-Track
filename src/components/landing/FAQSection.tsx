import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI Smart Waste Identifier recognize materials?',
      a: 'EcoTrack utilizes Google Gemini Multimodal Vision API or our built-in offline Environmental Engine to analyze image pixels, shapes, reflections, logos, and printed recycling resin codes (#1 to #7). It calculates material density and outputs exact bin sorting guidelines in under 2 seconds.'
    },
    {
      q: 'How are Eco Points calculated for logged items?',
      a: 'Eco Points are weighted by material type and circular disposal method. Materials with intense virgin extraction footprints (like aluminum cans and electronics) earn the highest points. Composting food scraps earns a 1.2x circular bonus, whereas items sent to landfill earn 0 points.'
    },
    {
      q: 'Can I export my waste tracking history for compliance or academic reports?',
      a: 'Yes! EcoTrack provides one-click export for both raw CSV activity spreadsheets and formal, print-ready PDF Impact Audits that include documented EPA WARM formulas and charts.'
    },
    {
      q: 'How does the Recycling Center Locator find nearby facilities?',
      a: 'Using OpenStreetMap and browser geolocation (with your permission), EcoTrack pins certified municipal recovery depots, electronic waste collection sites, and organic drop-offs in your city. It also displays direct external navigation directions via Google Maps or OpenStreetMap.'
    },
    {
      q: 'Can I keep my profile private on the Community Leaderboard?',
      a: 'Absolutely. Privacy is built-in. You can toggle "Show profile on Leaderboard" on or off in your profile settings at any time without losing points or badges.'
    },
    {
      q: 'How do I connect my own live Supabase or Google Gemini API key?',
      a: 'Click the Database icon in the navigation bar or configure the `.env` file with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_GEMINI_API_KEY`. EcoTrack runs seamlessly in full Demo Store mode even without external keys!'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Everything you need to know about EcoTrack, AI scanning, and impact tracking.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border border-emerald-500/20 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-emerald-950/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
