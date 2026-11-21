-- ========================================================
-- ECOTRACK PLATFORM - SUPABASE DATABASE SCHEMA
-- PostgreSQL schema for 10 tables with Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    eco_points INTEGER NOT NULL DEFAULT 100,
    level INTEGER NOT NULL DEFAULT 1,
    level_title TEXT NOT NULL DEFAULT 'Seedling',
    bio TEXT DEFAULT 'Passionate about zero-waste living and sustainability.',
    location TEXT DEFAULT 'Earth',
    is_public_on_leaderboard BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WASTE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.waste_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Plastic', 'Paper', 'Glass', 'Metal', 'Electronic waste', 'Organic waste', 'Other')),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'g', 'lbs', 'items')),
    quantity_kg NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    disposal_method TEXT NOT NULL CHECK (disposal_method IN ('Recycled', 'Composted', 'Landfill', 'Donated', 'Repurposed')),
    eco_points_earned INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. WASTE ANALYSES TABLE (AI Identifications)
CREATE TABLE IF NOT EXISTS public.waste_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    image_url TEXT,
    material_identified TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Plastic', 'Paper', 'Glass', 'Metal', 'Electronic waste', 'Organic waste', 'Other')),
    recyclability TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    decomposition_estimate TEXT NOT NULL,
    disposal_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    bin_recommendation TEXT NOT NULL,
    carbon_footprint_impact TEXT,
    analyzed_via TEXT NOT NULL DEFAULT 'gemini-ai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RECYCLING CENTERS TABLE
CREATE TABLE IF NOT EXISTS public.recycling_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT NOT NULL,
    accepted_materials JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ECO POINTS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.eco_points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    duration_days INTEGER NOT NULL,
    points_reward INTEGER NOT NULL,
    badge_reward TEXT,
    icon TEXT NOT NULL,
    participants_count INTEGER NOT NULL DEFAULT 0,
    target_goal TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. USER CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    current_progress INTEGER NOT NULL DEFAULT 0,
    target_progress INTEGER NOT NULL DEFAULT 1,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id)
);

-- 8. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    category TEXT NOT NULL,
    requirement_description TEXT NOT NULL
);

-- 9. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- 10. CHATBOT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read leaderboard profiles, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Waste records: Only owner can view, insert, update, delete
CREATE POLICY "Users can view own waste records" ON public.waste_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waste records" ON public.waste_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own waste records" ON public.waste_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own waste records" ON public.waste_records
    FOR DELETE USING (auth.uid() = user_id);

-- Waste analyses: Users see own analyses or public ones
CREATE POLICY "Users can view own analyses" ON public.waste_analyses
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own analyses" ON public.waste_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Recycling centers: Anyone can view, admin can insert/update/delete
CREATE POLICY "Recycling centers are viewable by everyone" ON public.recycling_centers
    FOR SELECT USING (true);

-- Challenges & Achievements: Viewable by everyone
CREATE POLICY "Challenges viewable by all" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Achievements viewable by all" ON public.achievements FOR SELECT USING (true);

-- User Challenges & User Achievements: Own records
CREATE POLICY "Users see own challenges" ON public.user_challenges
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own achievements" ON public.user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Eco points transactions: Users view own transactions
CREATE POLICY "Users view own transactions" ON public.eco_points_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Chatbot conversations: Users view own chat logs
CREATE POLICY "Users view own chatbot messages" ON public.chatbot_conversations
    FOR ALL USING (auth.uid() = user_id);

-- ========================================================
-- SEED DATA FOR DEMO & TESTING
-- ========================================================
INSERT INTO public.achievements (code, title, description, icon, points, category, requirement_description) VALUES
('first_log', 'First Step', 'Logged your first waste item into the system', 'Award', 50, 'tracker', 'Log 1 waste item'),
('plastic_diverter', 'Plastic Diverter', 'Diverted over 10 kg of plastic from landfills', 'ShieldCheck', 150, 'recycler', 'Divert 10kg of plastic'),
('paper_champion', 'Paper Guardian', 'Recycled paper consistently for 7 days', 'FileText', 120, 'streak', 'Recycle paper for 7 consecutive days'),
('ai_explorer', 'Eco Visionary', 'Used AI Smart Waste Identifier 5 times', 'Sparkles', 100, 'ai', 'Analyze 5 items using AI'),
('zero_waste_hero', 'Zero-Waste Hero', 'Maintained a diversion rate above 80% for a month', 'Flame', 300, 'community', 'Achieve 80%+ diversion rate')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.challenges (title, category, description, difficulty, duration_days, points_reward, badge_reward, icon, target_goal) VALUES
('Plastic Free Week', 'Plastic', 'Avoid single-use plastic bottles, cutlery, and bags for 7 consecutive days.', 'Medium', 7, 250, 'Plastic Free Pioneer', 'CupSoda', '7 days zero single-use plastic'),
('Paper Recycling Sprint', 'Paper', 'Collect, flatten and recycle all household cardboard and paper waste.', 'Easy', 5, 150, 'Paper Master', 'Layers', 'Recycle at least 5 kg paper/cardboard'),
('E-Waste Sweep', 'Electronic waste', 'Safely dispose of unused cables, old batteries, or obsolete electronics at an e-waste center.', 'Hard', 14, 350, 'E-Cycle Champion', 'Cpu', 'Drop off e-waste at certified facility'),
('Compost Starter', 'Organic waste', 'Segregate food scraps and organic peels into home compost or green bin.', 'Medium', 10, 200, 'Compost Connoisseur', 'Sprout', '10 days organic waste segregation')
ON CONFLICT DO NOTHING;
