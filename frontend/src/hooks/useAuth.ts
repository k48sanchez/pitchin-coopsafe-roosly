import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

type AsyncState = {
  loading: boolean;
  error: string | null;
};

/**
 * Wraps the three Phase 1 auth actions: sign up, log in, verify email.
 *
 * Email verification uses a 6-digit OTP code rather than a magic link —
 * this needs to be turned on in the Supabase dashboard:
 *   Authentication → Email Templates → "Confirm signup" → use {{ .Token }}
 *   Authentication → Providers → Email → keep "Confirm email" ON
 * Magic links would require deep-link handling in the app, which is more
 * setup for the same result; OTP keeps verification inside one screen.
 */
export function useAuth() {
  const [state, setState] = useState<AsyncState>({ loading: false, error: null });

  const signUp = useCallback(async (email: string, password: string) => {
    setState({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    setState({ loading: false, error: error?.message ?? null });
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setState({ loading: false, error: error?.message ?? null });
    return { data, error };
  }, []);

  const verifyEmailOtp = useCallback(async (email: string, token: string) => {
    setState({ loading: true, error: null });
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    setState({ loading: false, error: error?.message ?? null });
    return { data, error };
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    setState({ loading: true, error: null });
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setState({ loading: false, error: error?.message ?? null });
    return { error };
  }, []);

  return {
    ...state,
    signUp,
    signIn,
    verifyEmailOtp,
    resendVerificationEmail,
  };
}
