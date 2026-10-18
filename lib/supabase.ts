import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from '@/types/database';

const configuredUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const configuredAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured =
  configuredUrl.length > 0 &&
  configuredAnonKey.length > 0 &&
  !configuredUrl.includes('your-project') &&
  !configuredAnonKey.includes('your-anon-key');

// Supabase validates its URL and key during client construction, including during
// Expo Router's server rendering. These inert values let the app show its setup
// screen when env vars are absent; all authenticated flows remain gated below.
const supabaseUrl = configuredUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = configuredAnonKey || 'not-configured';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
  },
});
