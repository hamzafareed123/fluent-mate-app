import { format, subDays, parseISO } from 'date-fns';

/** Local calendar day key (YYYY-MM-DD). */
export function localDateKey(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Updates streak when learner completes activity on `activityDate`.
 * Uses local-day boundaries; missing one day resets streak to 1 on next activity.
 */
export function computeStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null,
  activityDate = localDateKey(),
): { current_streak: number; longest_streak: number; last_activity_date: string } {
  if (!lastActivityDate) {
    return {
      current_streak: 1,
      longest_streak: Math.max(longestStreak, 1),
      last_activity_date: activityDate,
    };
  }

  if (lastActivityDate === activityDate) {
    return {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_activity_date: activityDate,
    };
  }

  const yesterday = localDateKey(subDays(parseISO(`${activityDate}T12:00:00`), 1));
  const nextStreak = lastActivityDate === yesterday ? currentStreak + 1 : 1;

  return {
    current_streak: nextStreak,
    longest_streak: Math.max(longestStreak, nextStreak),
    last_activity_date: activityDate,
  };
}
