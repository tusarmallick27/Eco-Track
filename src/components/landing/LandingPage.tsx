import React from 'react';
import { HeroSection } from './HeroSection';
import { StatsTicker } from './StatsTicker';
import { FeaturesGrid } from './FeaturesGrid';
import { HowItWorks } from './HowItWorks';
import { ImpactSection } from './ImpactSection';
import { Testimonials } from './Testimonials';
import { FAQSection } from './FAQSection';

interface LandingPageProps {
  onStartTracking: () => void;
  onSelectFeature: (featureId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartTracking, onSelectFeature }) => {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0">
      <HeroSection 
        onStartTracking={onStartTracking} 
        onExploreFeatures={handleScrollToFeatures} 
      />
      <StatsTicker />
      <FeaturesGrid onSelectFeature={onSelectFeature} />
      <HowItWorks />
      <ImpactSection />
      <Testimonials />
      <FAQSection />
    </div>
  );
};
