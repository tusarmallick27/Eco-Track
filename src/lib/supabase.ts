import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

// Supabase client instance (initialized if configured, otherwise null or dummy client)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock-ecotrack.supabase.co', 'mock-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    url: supabaseUrl ? supabaseUrl.replace(/https:\/\/(.{4}).*(\..*)/, 'https://$1***$2') : 'Not Set',
    hasKey: Boolean(supabaseAnonKey),
  };
}
