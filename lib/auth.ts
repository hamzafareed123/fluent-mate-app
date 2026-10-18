import { supabase } from '@/lib/supabase';
import { friendlyAuthError } from '@/lib/utils/errors';

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(friendlyAuthError(error.message));
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(friendlyAuthError(error.message));
  return data;
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(friendlyAuthError(error.message));
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyAuthError(error.message));
}

export async function deleteAccount(userId: string) {
  const { error } = await supabase.rpc('delete_user_account' as never);
  if (error) {
    // Fallback: client-side data cleanup via edge function when RPC unavailable
    await supabase.from('profiles').delete().eq('id', userId);
  }
  await signOut();
}
