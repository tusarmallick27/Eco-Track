import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { AuthModal } from './components/auth/AuthModal';
import { SupabaseSetupModal } from './components/common/SupabaseSetupModal';
import { WasteFormModal } from './components/tracker/WasteFormModal';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { WasteIdentifier } from './components/ai-identifier/WasteIdentifier';
import { WasteTracker } from './components/tracker/WasteTracker';
import { RecyclingMap } from './components/map/RecyclingMap';
import { ChallengesPage } from './components/gamification/ChallengesPage';
import { BadgesAndRewards } from './components/gamification/BadgesAndRewards';
import { LeaderboardPage } from './components/gamification/LeaderboardPage';
import { EcoBotChat } from './components/ecobot/EcoBotChat';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import { WasteCategory } from './types';

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);
  const [wasteFormModalOpen, setWasteFormModalOpen] = useState<boolean>(false);
  
  // State for pre-filling waste form from AI Scanner
  const [preFillCategory, setPreFillCategory] = useState<WasteCategory>('Plastic');
  const [preFillDescription, setPreFillDescription] = useState<string>('');

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleStartTracking = () => {
    if (isAuthenticated) {
      setCurrentTab('dashboard');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handlePreFillWasteRecord = (category: WasteCategory, description: string) => {
    setPreFillCategory(category);
    setPreFillDescription(description);
    setWasteFormModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07130e] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Demo helper banner */}
      <DemoBanner 
        openSupabaseModal={() => setSupabaseModalOpen(true)} 
        setCurrentTab={setCurrentTab}
      />

      {/* Main navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={() => setAuthModalOpen(true)}
        openSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentTab === 'landing' && (
          <LandingPage
            onStartTracking={handleStartTracking}
            onSelectFeature={(featId) => setCurrentTab(featId)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardOverview
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenAddWasteModal={() => {
              setPreFillDescription('');
              setWasteFormModalOpen(true);
            }}
          />
        )}

        {currentTab === 'ai-identifier' && (
          <WasteIdentifier
            onPreFillWasteRecord={handlePreFillWasteRecord}
            openSupabaseModal={() => setSupabaseModalOpen(true)}
          />
        )}

        {currentTab === 'tracker' && (
          <WasteTracker
            onOpenAddModal={() => {
              setPreFillDescription('');
              setWasteFormModalOpen(true);
            }}
          />
        )}

        {currentTab === 'map' && <RecyclingMap />}

        {currentTab === 'challenges' && <ChallengesPage />}

        {currentTab === 'leaderboard' && <LeaderboardPage />}

        {currentTab === 'analytics' && <AnalyticsPage />}

        {currentTab === 'ecobot' && <EcoBotChat />}

        {currentTab === 'admin' && <AdminDashboard />}

      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        openSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentTab('dashboard');
        }}
      />

      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      <WasteFormModal
        isOpen={wasteFormModalOpen}
        onClose={() => setWasteFormModalOpen(false)}
        initialCategory={preFillCategory}
        initialDescription={preFillDescription}
      />

    </div>
  );
};

export default function App() {
  return <AppContent />;
}
