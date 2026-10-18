import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { OnboardingValues } from '@/lib/validation';
import type { Database } from '@/types/database';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfile() {
  const { user, profile, refreshProfile } = useAuth();

  const updateProfile = useCallback(
    async (patch: ProfileUpdate) => {
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
    },
    [user, refreshProfile],
  );

  const saveOnboarding = useCallback(
    async (values: OnboardingValues) => {
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: values.display_name,
        primary_goal: values.primary_goal,
        daily_goal_minutes: values.daily_goal_minutes,
        self_reported_level: values.self_reported_level,
        correction_preference: values.correction_preference,
        preferred_accent: values.preferred_accent ?? null,
        onboarding_completed: true,
      });
      if (error) throw error;
      await refreshProfile();
    },
    [user, refreshProfile],
  );

  return { profile, updateProfile, saveOnboarding, refreshProfile };
}
