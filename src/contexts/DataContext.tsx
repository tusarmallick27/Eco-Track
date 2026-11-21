import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  WasteRecord, 
  RecyclingCenter, 
  Challenge, 
  UserChallenge, 
  Achievement, 
  UserAchievement, 
  EcoPointsTransaction, 
  WasteAnalysis, 
  EnvironmentalImpactSummary,
  WasteCategory,
  DisposalMethod,
  MeasurementUnit
} from '../types';
import { LocalStore } from '../lib/storage';
import { calculateImpactSummary, calculateEcoPoints, normalizeToKg, getUserLevelInfo } from '../lib/impactCalculator';
import { useAuth } from './AuthContext';

interface DataContextType {
  wasteRecords: WasteRecord[];
  recyclingCenters: RecyclingCenter[];
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  transactions: EcoPointsTransaction[];
  analyses: WasteAnalysis[];
  impactSummary: EnvironmentalImpactSummary;
  addWasteRecord: (record: {
    category: WasteCategory;
    quantity: number;
    unit: MeasurementUnit;
    date: string;
    description: string;
    disposal_method: DisposalMethod;
    notes?: string;
  }) => WasteRecord;
  updateWasteRecord: (id: string, updates: Partial<WasteRecord>) => void;
  deleteWasteRecord: (id: string) => void;
  saveWasteAnalysis: (analysis: WasteAnalysis) => void;
  joinChallenge: (challengeId: string) => void;
  incrementChallengeProgress: (challengeId: string) => void;
  completeChallenge: (challengeId: string) => void;
  addRecyclingCenter: (center: Omit<RecyclingCenter, 'id'>) => void;
  deleteRecyclingCenter: (id: string) => void;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'participants_count' | 'created_at'>) => void;
  triggerConfetti: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();

  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => LocalStore.getWasteRecords());
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>(() => LocalStore.getRecyclingCenters());
  const [challenges, setChallenges] = useState<Challenge[]>(() => LocalStore.getChallenges());
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>(() => LocalStore.getUserChallenges());
  const [achievements] = useState<Achievement[]>(() => LocalStore.getAchievements());
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(() => LocalStore.getUserAchievements());
  const [transactions, setTransactions] = useState<EcoPointsTransaction[]>(() => LocalStore.getTransactions());
  const [analyses, setAnalyses] = useState<WasteAnalysis[]>(() => LocalStore.getWasteAnalyses());

  // Save to LocalStore whenever records change
  useEffect(() => {
    LocalStore.setWasteRecords(wasteRecords);
  }, [wasteRecords]);

  useEffect(() => {
    LocalStore.setRecyclingCenters(recyclingCenters);
  }, [recyclingCenters]);

  useEffect(() => {
    LocalStore.setChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    LocalStore.setUserChallenges(userChallenges);
  }, [userChallenges]);

  useEffect(() => {
    LocalStore.setUserAchievements(userAchievements);
  }, [userAchievements]);

  useEffect(() => {
    LocalStore.setTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    LocalStore.setWasteAnalyses(analyses);
  }, [analyses]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#84cc16', '#34d399', '#facc15']
      });
    } catch {
      // safe fallback if canvas is unavailable
    }
  };

  const addPoints = (amount: number, type: EcoPointsTransaction['transaction_type'], description: string) => {
    if (!user) return;
    const newTx: EcoPointsTransaction = {
      id: 'tx_' + Date.now(),
      user_id: user.id,
      amount,
      transaction_type: type,
      description,
      created_at: new Date().toISOString(),
    };

    setTransactions(prev => [newTx, ...prev]);

    const newTotalPoints = (user.eco_points || 0) + amount;
    const levelInfo = getUserLevelInfo(newTotalPoints);

    updateUserProfile({
      eco_points: newTotalPoints,
      level: levelInfo.level,
      level_title: levelInfo.title,
    });
  };

  const addWasteRecord = (data: {
    category: WasteCategory;
    quantity: number;
    unit: MeasurementUnit;
    date: string;
    description: string;
    disposal_method: DisposalMethod;
    notes?: string;
  }): WasteRecord => {
    const quantity_kg = normalizeToKg(data.quantity, data.unit);
    const eco_points_earned = calculateEcoPoints(data.category, quantity_kg, data.disposal_method);

    const newRecord: WasteRecord = {
      id: 'rec_' + Date.now(),
      user_id: user?.id || 'usr_guest',
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      quantity_kg,
      date: data.date,
      description: data.description,
      disposal_method: data.disposal_method,
      eco_points_earned,
      created_at: new Date().toISOString(),
      notes: data.notes,
    };

    setWasteRecords(prev => [newRecord, ...prev]);

    if (eco_points_earned > 0) {
      addPoints(
        eco_points_earned,
        'waste_logged',
        `Logged ${quantity_kg} kg ${data.category} (${data.disposal_method})`
      );
      triggerConfetti();
    }

    return newRecord;
  };

  const updateWasteRecord = (id: string, updates: Partial<WasteRecord>) => {
    setWasteRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      const updated = { ...rec, ...updates };
      if (updates.quantity !== undefined || updates.unit !== undefined) {
        updated.quantity_kg = normalizeToKg(updated.quantity, updated.unit);
      }
      return updated;
    }));
  };

  const deleteWasteRecord = (id: string) => {
    setWasteRecords(prev => prev.filter(rec => rec.id !== id));
  };

  const saveWasteAnalysis = (analysis: WasteAnalysis) => {
    setAnalyses(prev => [analysis, ...prev]);
    // Reward points for AI scanning
    addPoints(20, 'ai_scan', `Scanned ${analysis.material_identified} with AI Vision`);
    triggerConfetti();
  };

  const joinChallenge = (challengeId: string) => {
    if (!user) return;
    const existing = userChallenges.find(uc => uc.challenge_id === challengeId);
    if (existing) return;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const newUc: UserChallenge = {
      id: 'uc_' + Date.now(),
      user_id: user.id,
      challenge_id: challengeId,
      status: 'active',
      current_progress: 0,
      target_progress: challenge.duration_days,
      joined_at: new Date().toISOString(),
    };

    setUserChallenges(prev => [...prev, newUc]);
    // Increment challenge participant counter
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, participants_count: c.participants_count + 1 } : c));
  };

  const incrementChallengeProgress = (challengeId: string) => {
    setUserChallenges(prev => prev.map(uc => {
      if (uc.challenge_id !== challengeId || uc.status !== 'active') return uc;
      const nextProgress = uc.current_progress + 1;
      if (nextProgress >= uc.target_progress) {
        completeChallenge(challengeId);
        return {
          ...uc,
          current_progress: nextProgress,
          status: 'completed',
          completed_at: new Date().toISOString(),
        };
      }
      return { ...uc, current_progress: nextProgress };
    }));
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    setUserChallenges(prev => prev.map(uc => {
      if (uc.challenge_id === challengeId) {
        return { ...uc, status: 'completed', completed_at: new Date().toISOString(), current_progress: uc.target_progress };
      }
      return uc;
    }));

    addPoints(challenge.points_reward, 'challenge_completed', `Completed "${challenge.title}" Challenge`);
    triggerConfetti();
  };

  const addRecyclingCenter = (centerData: Omit<RecyclingCenter, 'id'>) => {
    const newCenter: RecyclingCenter = {
      ...centerData,
      id: 'rc_' + Date.now(),
    };
    setRecyclingCenters(prev => [newCenter, ...prev]);
  };

  const deleteRecyclingCenter = (id: string) => {
    setRecyclingCenters(prev => prev.filter(c => c.id !== id));
  };

  const addChallenge = (challengeData: Omit<Challenge, 'id' | 'participants_count' | 'created_at'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: 'ch_' + Date.now(),
      participants_count: 1,
      created_at: new Date().toISOString(),
    };
    setChallenges(prev => [newChallenge, ...prev]);
  };

  const impactSummary = calculateImpactSummary(wasteRecords);

  return (
    <DataContext.Provider
      value={{
        wasteRecords,
        recyclingCenters,
        challenges,
        userChallenges,
        achievements,
        userAchievements,
        transactions,
        analyses,
        impactSummary,
        addWasteRecord,
        updateWasteRecord,
        deleteWasteRecord,
        saveWasteAnalysis,
        joinChallenge,
        incrementChallengeProgress,
        completeChallenge,
        addRecyclingCenter,
        deleteRecyclingCenter,
        addChallenge,
        triggerConfetti,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
