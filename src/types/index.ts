export type UserRole = 'user' | 'admin';

export type WasteCategory = 
  | 'Plastic'
  | 'Paper'
  | 'Glass'
  | 'Metal'
  | 'Electronic waste'
  | 'Organic waste'
  | 'Other';

export type DisposalMethod = 
  | 'Recycled'
  | 'Composted'
  | 'Landfill'
  | 'Donated'
  | 'Repurposed';

export type MeasurementUnit = 'kg' | 'g' | 'lbs' | 'items';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  eco_points: number;
  level: number;
  level_title: string;
  bio?: string;
  location?: string;
  is_public_on_leaderboard: boolean;
  created_at: string;
}

export interface WasteRecord {
  id: string;
  user_id: string;
  category: WasteCategory;
  quantity: number;
  unit: MeasurementUnit;
  quantity_kg: number; // Normalized to kg for uniform analytics
  date: string;
  description: string;
  disposal_method: DisposalMethod;
  eco_points_earned: number;
  created_at: string;
  notes?: string;
}

export interface WasteAnalysis {
  id: string;
  user_id?: string;
  image_url?: string;
  material_identified: string;
  category: WasteCategory;
  recyclability: 'High' | 'Moderate' | 'Low' | 'Special Handling' | 'Non-Recyclable';
  confidence_score: number;
  decomposition_estimate: string;
  disposal_instructions: string[];
  bin_recommendation: string;
  carbon_footprint_impact: string;
  created_at: string;
  analyzed_via: 'gemini-ai' | 'ecotrack-vision-engine';
}

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  hours: string;
  accepted_materials: WasteCategory[];
  is_verified: boolean;
  notes?: string;
  is_demo?: boolean;
}

export interface EcoPointsTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'waste_logged' | 'challenge_completed' | 'ai_scan' | 'community_event' | 'streak_bonus';
  description: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: WasteCategory | 'General';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration_days: number;
  points_reward: number;
  badge_reward?: string;
  icon: string;
  participants_count: number;
  target_goal: string;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'abandoned';
  current_progress: number;
  target_progress: number;
  joined_at: string;
  completed_at?: string;
  challenge?: Challenge;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'tracker' | 'ai' | 'community' | 'streak' | 'recycler';
  requirement_description: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  avatar_url?: string;
  eco_points: number;
  recycled_kg: number;
  badges_count: number;
  level_title: string;
  is_current_user?: boolean;
}

export interface EnvironmentalImpactSummary {
  total_waste_kg: number;
  recycled_waste_kg: number;
  composted_waste_kg: number;
  landfill_diverted_kg: number;
  diversion_rate_percentage: number;
  co2_saved_kg: number;
  water_saved_liters: number;
  energy_saved_kwh: number;
  trees_equivalent: number;
}
