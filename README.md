# EcoTrack — Smart Sustainability & Waste Management Platform

> **"Track Waste. Save Earth. Inspire Change."**

EcoTrack is a modern, full-stack sustainability technology platform designed to help households, communities, and organizations monitor waste diversion, identify recyclable packaging via computer vision, locate specialized recovery depots, and participate in gamified circular challenges.

---

## 🚀 Live Local Development Link

The development server is running and accessible at:
- **Local:** [http://localhost:5173/](http://localhost:5173/)
- **Network:** [http://10.131.231.50:5173/](http://10.131.231.50:5173/)

---

## 🌟 Key Features

1. **AI Smart Waste Identifier:**
   - Multimodal image classification powered by Google Gemini 1.5 Flash Vision & built-in Environmental Neural Engine.
   - Identifies resin codes (PET #1, HDPE #2, PP #5, etc.), recyclability index, decomposition lifespan, and step-by-step bin segregation instructions.
   - 1-click test presets included (PET water bottle, soda can, cardboard box, e-waste smartphone, organic scraps, styrofoam cup).

2. **Interactive Waste Tracker (Full CRUD):**
   - Log plastics, metals, paper, e-waste, organics, and glass.
   - Real-time unit conversions to kilograms.
   - Filter by material category, date range, and disposal method (Recycled, Composted, Landfill, Donated, Repurposed).

3. **Recycling Center Locator:**
   - Interactive OpenStreetMap (Leaflet) discovery with custom glowing pins.
   - Search by city or area (Seattle, San Francisco, New York, etc.).
   - Browser geolocation support.
   - Direct external GPS navigation links via Google Maps / OSM.

4. **Gamification & Eco Challenges:**
   - User levels (Seedling → Sprout → Eco Scout → Green Guardian → Planet Protector → Earth Champion).
   - Milestone badges and celebratory confetti animations.
   - Actionable 7-day sustainability sprints (Plastic-Free Week, Paper Recycling Sprint, E-Waste Sweep).

5. **Community Leaderboard & Privacy Control:**
   - Real-time rankings by eco points and diverted kilograms.
   - Top 3 podium highlight.
   - User privacy toggle to show or hide profile from public leaderboard.

6. **EcoBot AI Assistant:**
   - 24/7 circular economy advisor for sorting questions, composting chemistry, and battery disposal.
   - One-click suggested prompts, typing indicator, and conversation history.

7. **Certified Analytics & Documented Impact (EPA WARM):**
   - Greenhouse gas avoidance (kg CO2e) based on EPA WARM v15 factors.
   - Water and energy conservation metrics.
   - One-click export for **CSV data spreadsheets** and **Print-Ready PDF Impact Audits**.

8. **Administrator Console:**
   - Role-based security (normal user vs administrator).
   - Manage recycling depot directory and approve locations.
   - Create and publish new community challenges.
   - Security audit logs.

9. **Judge & Hackathon Demo Mode:**
   - Zero-friction one-click switching between regular user (*Alex Green*) and administrator (*Sarah Vance*).
   - Works 100% out of the box with offline persistence even before adding external API keys.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Mapping:** OpenStreetMap & Leaflet (`leaflet`, `react-leaflet`)
- **Charts:** Recharts
- **PDF Generation:** jsPDF
- **Backend & Database:** Supabase, PostgreSQL, Row Level Security (RLS)
- **AI Vision & Chat:** Google Gemini API (`gemini-1.5-flash`) + Built-in Vision Fallback Engine
- **Build Tool:** Vite

---

## 📦 Database Setup (Supabase)

A complete 10-table PostgreSQL schema with Row Level Security (RLS) is located at:
`supabase/schema.sql`

Tables:
1. `profiles`
2. `waste_records`
3. `waste_analyses`
4. `recycling_centers`
5. `eco_points_transactions`
6. `challenges`
7. `user_challenges`
8. `achievements`
9. `user_achievements`
10. `chatbot_conversations`

To connect to your own Supabase project:
1. Copy `.env.example` to `.env`.
2. Paste your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run the SQL schema from `supabase/schema.sql` inside your Supabase SQL Editor.

---

## 📄 License

MIT License — Built for the planet.
