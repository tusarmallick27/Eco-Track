import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { LocalStore } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_USER_PROFILE, INITIAL_ADMIN_PROFILE } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  toggleLeaderboardPrivacy: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ecotrack_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_PROFILE;
      }
    }
    // Start with demo user pre-authenticated for immediate convenience or null
    return INITIAL_USER_PROFILE;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return !isSupabaseConfigured || localStorage.getItem('ecotrack_is_demo') !== 'false';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecotrack_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecotrack_auth_user');
    }
  }, [user]);

  // Check Supabase session on mount if Supabase is configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile from Supabase
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setUser(data as UserProfile);
              setIsDemoMode(false);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser(data as UserProfile);
              setIsDemoMode(false);
            }
          });
      } else {
        if (!isDemoMode) setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser(profile as UserProfile);
          setIsDemoMode(false);
          return { success: true };
        }
      }
    }

    // Local / Offline demo auth check
    if (email.toLowerCase().includes('admin')) {
      setUser(INITIAL_ADMIN_PROFILE);
      setIsDemoMode(true);
      return { success: true };
    }

    const demoUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      email,
      name: email.split('@')[0] || 'Eco Track User',
    };
    setUser(demoUser);
    setIsDemoMode(true);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || !pass) {
      return { success: false, error: 'All fields are required.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          email,
          name,
          role: 'user',
          eco_points: 100,
          level: 1,
          level_title: 'Seedling',
          is_public_on_leaderboard: true,
          created_at: new Date().toISOString(),
        };

        await supabase.from('profiles').insert([newProfile]);
        setUser(newProfile);
        setIsDemoMode(false);
        return { success: true };
      }
    }

    // Local Demo registration
    const newDemoUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      role: 'user',
      eco_points: 100, // Welcome bonus
      level: 1,
      level_title: 'Seedling',
      bio: 'New explorer on the path to zero waste living.',
      location: 'Community Member',
      is_public_on_leaderboard: true,
      created_at: new Date().toISOString(),
    };

    LocalStore.setProfile(newDemoUser);
    setUser(newDemoUser);
    setIsDemoMode(true);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('ecotrack_auth_user');
  };

  const loginAsDemoUser = () => {
    const user = LocalStore.getProfile();
    setUser(user);
    setIsDemoMode(true);
  };

  const loginAsDemoAdmin = () => {
    const admin = LocalStore.getAdminProfile();
    setUser(admin);
    setIsDemoMode(true);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (updated.role === 'admin') {
      LocalStore.setAdminProfile(updated);
    } else {
      LocalStore.setProfile(updated);
    }

    if (isSupabaseConfigured && !isDemoMode) {
      supabase.from('profiles').update(updates).eq('id', user.id).then();
    }
  };

  const toggleLeaderboardPrivacy = () => {
    if (!user) return;
    updateUserProfile({ is_public_on_leaderboard: !user.is_public_on_leaderboard });
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!email) return { success: false, message: 'Please enter your email address.' };

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Password recovery email sent! Check your inbox.' };
    }

    return { 
      success: true, 
      message: `Password reset instructions sent to ${email} (Demo Mode simulation).` 
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isDemoMode,
        login,
        register,
        logout,
        loginAsDemoUser,
        loginAsDemoAdmin,
        updateUserProfile,
        resetPassword,
        toggleLeaderboardPrivacy,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
