import { useCallback, useEffect, useState } from 'react';
import { subDays, format } from 'date-fns';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { localDateKey } from '@/lib/utils/streak';

export type ProgressSnapshot = {
  totalXp: number;
  streak: number;
  speakingMinutesWeek: number;
  milestonesCompletedWeek: number;
  latestAssessmentLevel: string | null;
  dailyStats: { date: string; xp: number; speaking: number }[];
  topMistakes: { original_text: string; occurrence_count: number }[];
};

export function useProgress() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<ProgressSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');

    const [statsRes, assessmentRes, mistakesRes, sessionsRes] = await Promise.all([
      supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('local_date', weekStart)
        .order('local_date', { ascending: true }),
      supabase
        .from('assessments')
        .select('estimated_cefr_level')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('mistakes')
        .select('original_text, occurrence_count')
        .eq('user_id', user.id)
        .order('occurrence_count', { ascending: false })
        .limit(5),
      supabase
        .from('conversation_sessions')
        .select('duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', `${weekStart}T00:00:00`),
    ]);

    if (statsRes.error) {
      setError(statsRes.error.message);
      setLoading(false);
      return;
    }

    const dailyStats = (statsRes.data ?? []).map((row) => ({
      date: row.local_date,
      xp: row.xp_earned,
      speaking: row.speaking_minutes,
    }));

    const speakingMinutesWeek = Math.round(
      ((sessionsRes.data ?? []).reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0) || 0) / 60,
    );

    const milestonesCompletedWeek = (statsRes.data ?? []).reduce(
      (sum, row) => sum + row.milestones_completed,
      0,
    );

    setData({
      totalXp: profile?.total_xp ?? 0,
      streak: profile?.current_streak ?? 0,
      speakingMinutesWeek,
      milestonesCompletedWeek,
      latestAssessmentLevel: assessmentRes.data?.estimated_cefr_level ?? profile?.estimated_cefr_level ?? null,
      dailyStats,
      topMistakes: mistakesRes.data ?? [],
    });
    setLoading(false);
  }, [user, profile]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh, today: localDateKey() };
}
