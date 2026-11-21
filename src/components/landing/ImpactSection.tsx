import React, { useState } from 'react';
import { Droplets, Zap, Trees, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { CO2_SAVINGS_PER_KG, WATER_SAVINGS_PER_KG, ENERGY_SAVINGS_PER_KG } from '../../lib/impactCalculator';

export const ImpactSection: React.FC = () => {
  const [calculatorKg, setCalculatorKg] = useState<number>(25);

  const estimatedCO2 = (calculatorKg * 1.5).toFixed(1);
  const estimatedWater = (calculatorKg * 18).toFixed(0);
  const estimatedEnergy = (calculatorKg * 5.8).toFixed(1);
  const treeEquiv = (Number(estimatedCO2) / 21.77).toFixed(1);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Description */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified LCA Modeling</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Measure Your True Impact with Science-Backed Data
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Unlike generic greenwashing claims, EcoTrack computes carbon offsets using published EPA WARM factors. We distinguish strictly between measured kilograms entered by users and estimated environmental offsets.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel border border-emerald-500/20">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Avoided Methane & Energy</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    1 kg of recycled aluminum saves 95% of virgin smelting energy; composting prevents anaerobic landfill gas emissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel border border-emerald-500/20">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-500 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Clean Water Conservation</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Paper recycling conserves thousands of liters of process water required in industrial wood pulping mills.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Simulator */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Interactive Impact Simulator
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Slide to simulate your monthly recycled waste
                </p>
              </div>
              <span className="text-lg font-black text-emerald-500 font-mono">
                {calculatorKg} kg
              </span>
            </div>

            <div className="mb-8">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={calculatorKg}
                onChange={(e) => setCalculatorKg(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-emerald-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>5 kg / mo</span>
                <span>50 kg / mo</span>
                <span>100 kg / mo</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase text-slate-400">CO2 Emissions Avoided</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  ~{estimatedCO2} <span className="text-xs font-normal">kg CO2e</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  ≈ {treeEquiv} mature tree absorption
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase text-slate-400">Freshwater Conserved</p>
                <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                  ~{estimatedWater} <span className="text-xs font-normal">Liters</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Prevents industrial pulping wash
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase text-slate-400">Energy Saved</p>
                <p className="text-xl font-black text-amber-500 mt-1">
                  ~{estimatedEnergy} <span className="text-xs font-normal">kWh</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Avoided virgin fossil fuels
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold uppercase text-slate-400">Eco Points Value</p>
                <p className="text-xl font-black text-lime-500 mt-1">
                  +{calculatorKg * 15} <span className="text-xs font-normal">pts</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Gamified level progression
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-6 text-center">
              *Calculated using standardized EPA WARM factor averages for mixed recyclable packaging streams.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
