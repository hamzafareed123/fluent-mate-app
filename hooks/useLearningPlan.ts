import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { generateDailyPlan } from '@/lib/api/ai';
import { supabase } from '@/lib/supabase';
import { localDateKey } from '@/lib/utils/streak';
import type { AssessmentReport } from '@/types/assessment';
import type { MilestoneView } from '@/types/learning';

export function useLearningPlan() {
  const { user, profile } = useAuth();
  const [milestones, setMilestones] = useState<MilestoneView[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodayPlan = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const today = localDateKey();

    const { data: plan, error: planError } = await supabase
      .from('learning_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('plan_date', today)
      .maybeSingle();

    if (planError) {
      setError(planError.message);
      setLoading(false);
      return;
    }

    if (!plan) {
      setPlanId(null);
      setMilestones([]);
      setLoading(false);
      return;
    }

    setPlanId(plan.id);

    const { data: rows, error: msError } = await supabase
      .from('milestones')
      .select('*')
      .eq('learning_plan_id', plan.id)
      .order('created_at', { ascending: true });

    if (msError) {
      setError(msError.message);
    } else {
      setMilestones((rows ?? []) as MilestoneView[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadTodayPlan();
  }, [loadTodayPlan]);

  const ensureDailyPlan = useCallback(
    async (assessment: AssessmentReport) => {
      if (!user || !profile) throw new Error('Profile required');
      const today = localDateKey();

      const { data: existing } = await supabase
        .from('learning_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('plan_date', today)
        .maybeSingle();

      if (existing) {
        await loadTodayPlan();
        return;
      }

      const generated = await generateDailyPlan({
        assessment,
        profile: profile as unknown as Record<string, unknown>,
        planDate: today,
      });

      const { data: planRow, error: insertPlanError } = await supabase
        .from('learning_plans')
        .insert({
          user_id: user.id,
          plan_date: today,
          plan_data: generated,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertPlanError) throw insertPlanError;

      const milestoneRows = generated.milestones.map((m) => ({
        user_id: user.id,
        learning_plan_id: planRow.id,
        title: m.title,
        description: m.description,
        activity_type: m.activity_type,
        difficulty: m.difficulty,
        estimated_minutes: m.estimated_minutes,
        completion_criteria: m.completion_criteria,
        xp_reward: m.xp_reward,
        status: 'pending' as const,
      }));

      const { error: msError } = await supabase.from('milestones').insert(milestoneRows);
      if (msError) throw msError;

      await loadTodayPlan();
    },
    [user, profile, loadTodayPlan],
  );

  const completeMilestone = useCallback(
    async (milestoneId: string) => {
      if (!user) throw new Error('Not signed in');
      const milestone = milestones.find((m) => m.id === milestoneId);
      if (!milestone || milestone.status === 'completed') return;

      const idempotencyKey = `${milestoneId}-${localDateKey()}`;

      const { error: completionError } = await supabase.from('milestone_completions').insert({
        user_id: user.id,
        milestone_id: milestoneId,
        idempotency_key: idempotencyKey,
        xp_awarded: milestone.xp_reward,
      });

      if (completionError) {
        if (!completionError.message.includes('duplicate')) {
          throw completionError;
        }
        return;
      }

      await supabase
        .from('milestones')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', milestoneId)
        .eq('user_id', user.id);

      const today = localDateKey();
      const { data: stats } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('local_date', today)
        .maybeSingle();

      if (stats) {
        await supabase
          .from('daily_stats')
          .update({
            xp_earned: stats.xp_earned + milestone.xp_reward,
            milestones_completed: stats.milestones_completed + 1,
          })
          .eq('id', stats.id);
      } else {
        await supabase.from('daily_stats').insert({
          user_id: user.id,
          local_date: today,
          xp_earned: milestone.xp_reward,
          speaking_minutes: 0,
          milestones_completed: 1,
        });
      }

      const { data: prof } = await supabase.from('profiles').select('total_xp').eq('id', user.id).single();
      if (prof) {
        await supabase
          .from('profiles')
          .update({ total_xp: (prof.total_xp ?? 0) + milestone.xp_reward })
          .eq('id', user.id);
      }

      await loadTodayPlan();
    },
    [user, milestones, loadTodayPlan],
  );

  return {
    milestones,
    planId,
    loading,
    error,
    loadTodayPlan,
    ensureDailyPlan,
    completeMilestone,
  };
}
