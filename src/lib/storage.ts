import { 
  UserProfile, 
  WasteRecord, 
  RecyclingCenter, 
  Challenge, 
  Achievement, 
  LeaderboardEntry,
  EcoPointsTransaction,
  UserChallenge,
  UserAchievement,
  WasteAnalysis,
  ChatMessage
} from '../types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_ADMIN_PROFILE,
  INITIAL_WASTE_RECORDS, 
  INITIAL_RECYCLING_CENTERS, 
  INITIAL_CHALLENGES, 
  INITIAL_USER_CHALLENGES,
  INITIAL_ACHIEVEMENTS, 
  INITIAL_USER_ACHIEVEMENTS,
  INITIAL_ECO_TRANSACTIONS, 
  INITIAL_LEADERBOARD 
} from './mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'ecotrack_profile',
  ADMIN_PROFILE: 'ecotrack_admin_profile',
  CURRENT_USER_ID: 'ecotrack_current_user_id',
  IS_DEMO_MODE: 'ecotrack_is_demo_mode',
  WASTE_RECORDS: 'ecotrack_waste_records',
  RECYCLING_CENTERS: 'ecotrack_recycling_centers',
  CHALLENGES: 'ecotrack_challenges',
  USER_CHALLENGES: 'ecotrack_user_challenges',
  ACHIEVEMENTS: 'ecotrack_achievements',
  USER_ACHIEVEMENTS: 'ecotrack_user_achievements',
  ECO_TRANSACTIONS: 'ecotrack_eco_transactions',
  LEADERBOARD: 'ecotrack_leaderboard',
  WASTE_ANALYSES: 'ecotrack_waste_analyses',
  CHAT_MESSAGES: 'ecotrack_chat_messages',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage key ${key}:`, err);
  }
}

export const LocalStore = {
  getProfile(): UserProfile {
    return getStoredItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  },
  setProfile(profile: UserProfile): void {
    setStoredItem(STORAGE_KEYS.USER_PROFILE, profile);
  },

  getAdminProfile(): UserProfile {
    return getStoredItem<UserProfile>(STORAGE_KEYS.ADMIN_PROFILE, INITIAL_ADMIN_PROFILE);
  },
  setAdminProfile(profile: UserProfile): void {
    setStoredItem(STORAGE_KEYS.ADMIN_PROFILE, profile);
  },

  getWasteRecords(): WasteRecord[] {
    return getStoredItem<WasteRecord[]>(STORAGE_KEYS.WASTE_RECORDS, INITIAL_WASTE_RECORDS);
  },
  setWasteRecords(records: WasteRecord[]): void {
    setStoredItem(STORAGE_KEYS.WASTE_RECORDS, records);
  },

  getRecyclingCenters(): RecyclingCenter[] {
    return getStoredItem<RecyclingCenter[]>(STORAGE_KEYS.RECYCLING_CENTERS, INITIAL_RECYCLING_CENTERS);
  },
  setRecyclingCenters(centers: RecyclingCenter[]): void {
    setStoredItem(STORAGE_KEYS.RECYCLING_CENTERS, centers);
  },

  getChallenges(): Challenge[] {
    return getStoredItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  },
  setChallenges(challenges: Challenge[]): void {
    setStoredItem(STORAGE_KEYS.CHALLENGES, challenges);
  },

  getUserChallenges(): UserChallenge[] {
    return getStoredItem<UserChallenge[]>(STORAGE_KEYS.USER_CHALLENGES, INITIAL_USER_CHALLENGES);
  },
  setUserChallenges(userChallenges: UserChallenge[]): void {
    setStoredItem(STORAGE_KEYS.USER_CHALLENGES, userChallenges);
  },

  getAchievements(): Achievement[] {
    return getStoredItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  },

  getUserAchievements(): UserAchievement[] {
    return getStoredItem<UserAchievement[]>(STORAGE_KEYS.USER_ACHIEVEMENTS, INITIAL_USER_CHALLENGES.length ? INITIAL_USER_ACHIEVEMENTS : []);
  },
  setUserAchievements(achievements: UserAchievement[]): void {
    setStoredItem(STORAGE_KEYS.USER_ACHIEVEMENTS, achievements);
  },

  getTransactions(): EcoPointsTransaction[] {
    return getStoredItem<EcoPointsTransaction[]>(STORAGE_KEYS.ECO_TRANSACTIONS, INITIAL_ECO_TRANSACTIONS);
  },
  setTransactions(txs: EcoPointsTransaction[]): void {
    setStoredItem(STORAGE_KEYS.ECO_TRANSACTIONS, txs);
  },

  getLeaderboard(): LeaderboardEntry[] {
    return getStoredItem<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  },
  setLeaderboard(lb: LeaderboardEntry[]): void {
    setStoredItem(STORAGE_KEYS.LEADERBOARD, lb);
  },

  getWasteAnalyses(): WasteAnalysis[] {
    return getStoredItem<WasteAnalysis[]>(STORAGE_KEYS.WASTE_ANALYSES, []);
  },
  setWasteAnalyses(analyses: WasteAnalysis[]): void {
    setStoredItem(STORAGE_KEYS.WASTE_ANALYSES, analyses);
  },

  getChatMessages(): ChatMessage[] {
    const defaultChat: ChatMessage[] = [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Hello! 👋 I'm **EcoBot**, your intelligent AI sustainability advisor. \n\nI can help you understand local recycling rules, identify how to properly segregate waste, find safe e-waste disposal methods, or give tips on zero-waste living. What can I help you with today?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Can I recycle greasy pizza boxes?',
          'How should I safely dispose of lithium batteries?',
          'How do I start home composting?',
          'What do plastic resin codes 1-7 mean?'
        ]
      }
    ];
    return getStoredItem<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, defaultChat);
  },
  setChatMessages(msgs: ChatMessage[]): void {
    setStoredItem(STORAGE_KEYS.CHAT_MESSAGES, msgs);
  },

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WASTE_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.RECYCLING_CENTERS);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.USER_CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.ECO_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.WASTE_ANALYSES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  }
};
