import { WasteRecord, EnvironmentalImpactSummary, WasteCategory, MeasurementUnit } from '../types';

/**
 * ENVIRONMENTAL IMPACT CALCULATION METHODOLOGY & ASSUMPTIONS:
 * 
 * Based on EPA WARM (Waste Reduction Model) v15 factors & environmental LCA studies:
 * 1. CO2e Savings (kg CO2 equivalent avoided per kg recycled):
 *    - Plastic (PET/HDPE): ~1.45 kg CO2e / kg recycled (avoids virgin resin refining & methane)
 *    - Paper/Cardboard: ~1.12 kg CO2e / kg recycled (preserves tree carbon sink & avoids landfill methane)
 *    - Glass: ~0.31 kg CO2e / kg recycled (reduces furnace melt energy)
 *    - Metal (Aluminum/Steel avg): ~4.20 kg CO2e / kg recycled (Aluminum alone saves ~9 kg CO2e/kg)
 *    - Electronic waste: ~2.80 kg CO2e / kg diverted (avoids intensive rare earth mining)
 *    - Organic waste (Composted): ~0.60 kg CO2e / kg composted (avoids anaerobic landfill methane CH4)
 *    - Other: ~0.20 kg CO2e / kg diverted
 * 
 * 2. Water Conserved:
 *    - Paper: ~26 Liters per kg recycled
 *    - Plastic: ~18 Liters per kg recycled
 *    - Metal: ~35 Liters per kg recycled
 *    - Organic: ~5 Liters per kg composted
 * 
 * 3. Energy Conserved:
 *    - Metal: ~9.5 kWh per kg recycled
 *    - Plastic: ~5.8 kWh per kg recycled
 *    - Paper: ~4.0 kWh per kg recycled
 *    - Glass: ~1.2 kWh per kg recycled
 * 
 * 4. Tree Equivalent:
 *    - 1 Mature tree absorbs ~21.77 kg of CO2 per year (~0.046 trees per kg CO2 saved)
 */

export const UNIT_CONVERSIONS_TO_KG: Record<MeasurementUnit, number> = {
  kg: 1.0,
  g: 0.001,
  lbs: 0.453592,
  items: 0.25, // Average estimated weight per standard container/item
};

export const CO2_SAVINGS_PER_KG: Record<WasteCategory, number> = {
  'Plastic': 1.45,
  'Paper': 1.12,
  'Glass': 0.31,
  'Metal': 4.20,
  'Electronic waste': 2.80,
  'Organic waste': 0.60,
  'Other': 0.20,
};

export const WATER_SAVINGS_PER_KG: Record<WasteCategory, number> = {
  'Plastic': 18.0,
  'Paper': 26.0,
  'Glass': 2.0,
  'Metal': 35.0,
  'Electronic waste': 15.0,
  'Organic waste': 5.0,
  'Other': 1.5,
};

export const ENERGY_SAVINGS_PER_KG: Record<WasteCategory, number> = {
  'Plastic': 5.8,
  'Paper': 4.0,
  'Glass': 1.2,
  'Metal': 9.5,
  'Electronic waste': 6.0,
  'Organic waste': 0.5,
  'Other': 0.8,
};

export function normalizeToKg(quantity: number, unit: MeasurementUnit): number {
  const factor = UNIT_CONVERSIONS_TO_KG[unit] || 1.0;
  return Number((quantity * factor).toFixed(2));
}

export function calculateEcoPoints(category: WasteCategory, quantityKg: number, method: string): number {
  let basePointsPerKg = 10;
  if (category === 'Electronic waste' || category === 'Metal') basePointsPerKg = 25;
  if (category === 'Plastic' || category === 'Paper') basePointsPerKg = 15;
  if (category === 'Glass' || category === 'Organic waste') basePointsPerKg = 12;

  let multiplier = 0;
  if (method === 'Recycled') multiplier = 1.0;
  else if (method === 'Composted') multiplier = 1.2; // Bonus for circular composting
  else if (method === 'Repurposed' || method === 'Donated') multiplier = 1.5;
  else if (method === 'Landfill') multiplier = 0.0; // No points for unmitigated landfill

  const points = Math.max(5, Math.round(quantityKg * basePointsPerKg * multiplier));
  return method === 'Landfill' ? 0 : points;
}

export function calculateImpactSummary(records: WasteRecord[]): EnvironmentalImpactSummary {
  let total_waste_kg = 0;
  let recycled_waste_kg = 0;
  let composted_waste_kg = 0;
  let landfill_diverted_kg = 0;
  let co2_saved_kg = 0;
  let water_saved_liters = 0;
  let energy_saved_kwh = 0;

  for (const record of records) {
    const kg = record.quantity_kg || normalizeToKg(record.quantity, record.unit);
    total_waste_kg += kg;

    const isDiverted = record.disposal_method !== 'Landfill';
    if (record.disposal_method === 'Recycled') {
      recycled_waste_kg += kg;
    } else if (record.disposal_method === 'Composted') {
      composted_waste_kg += kg;
    }

    if (isDiverted) {
      landfill_diverted_kg += kg;
      const co2Factor = CO2_SAVINGS_PER_KG[record.category] || 0.2;
      const waterFactor = WATER_SAVINGS_PER_KG[record.category] || 1.5;
      const energyFactor = ENERGY_SAVINGS_PER_KG[record.category] || 0.8;

      co2_saved_kg += kg * co2Factor;
      water_saved_liters += kg * waterFactor;
      energy_saved_kwh += kg * energyFactor;
    }
  }

  const diversion_rate_percentage = total_waste_kg > 0 
    ? Math.round((landfill_diverted_kg / total_waste_kg) * 100) 
    : 0;

  const trees_equivalent = Number((co2_saved_kg / 21.77).toFixed(1));

  return {
    total_waste_kg: Number(total_waste_kg.toFixed(2)),
    recycled_waste_kg: Number(recycled_waste_kg.toFixed(2)),
    composted_waste_kg: Number(composted_waste_kg.toFixed(2)),
    landfill_diverted_kg: Number(landfill_diverted_kg.toFixed(2)),
    diversion_rate_percentage,
    co2_saved_kg: Number(co2_saved_kg.toFixed(2)),
    water_saved_liters: Number(water_saved_liters.toFixed(1)),
    energy_saved_kwh: Number(energy_saved_kwh.toFixed(1)),
    trees_equivalent,
  };
}

export function getUserLevelInfo(points: number): { level: number; title: string; nextLevelPoints: number; progress: number } {
  const levels = [
    { level: 1, title: 'Seedling', threshold: 0 },
    { level: 2, title: 'Sprout', threshold: 250 },
    { level: 3, title: 'Eco Scout', threshold: 600 },
    { level: 4, title: 'Green Guardian', threshold: 1200 },
    { level: 5, title: 'Planet Protector', threshold: 2500 },
    { level: 6, title: 'Earth Champion', threshold: 5000 },
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].threshold) {
      current = levels[i];
      next = levels[i + 1] || { level: current.level + 1, title: 'Master Champion', threshold: current.threshold * 2 };
      break;
    }
  }

  const range = next.threshold - current.threshold;
  const progressInLevel = points - current.threshold;
  const progress = Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100)));

  return {
    level: current.level,
    title: current.title,
    nextLevelPoints: next.threshold,
    progress,
  };
}
