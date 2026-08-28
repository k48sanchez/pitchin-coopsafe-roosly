import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';

/**
 * Supabase requires `getItem`/`setItem`/`removeItem` to exist synchronously
 * on the object shape it's given, even though SecureStore is async — this
 * thin adapter satisfies that interface.
 *
 * IMPORTANT: session tokens live in expo-secure-store, not AsyncStorage,
 * per the security note in claude/repo-setup-guide.md.
 *
 * This is native-only (iOS/Android) — expo-secure-store has no web
 * implementation. On web, `storage` is left undefined below, which makes
 * supabase-js fall back to its own default (browser localStorage).
 */
const SecureStoreAdapter: SupportedStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Add them to frontend/.env (see .env.example).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // no deep-link handling needed; we use a confirmation link, not in-app OTP
  },
});