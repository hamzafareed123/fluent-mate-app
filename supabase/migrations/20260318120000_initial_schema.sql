-- FluentMate AI initial schema

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  primary_goal text,
  self_reported_level text,
  daily_goal_minutes integer,
  correction_preference text,
  preferred_accent text,
  onboarding_completed boolean not null default false,
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  estimated_cefr_level text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  assessment_type text not null default 'initial',
  estimated_cefr_level text not null,
  skill_scores jsonb not null,
  strengths text[],
  weaknesses text[],
  recommendations text,
  pronunciation_assessed boolean not null default false,
  assessment_version text not null default '1.0.0',
  raw_report jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learning_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_date date not null,
  plan_data jsonb not null,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, plan_date)
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  learning_plan_id uuid not null references public.learning_plans (id) on delete cascade,
  title text not null,
  description text,
  activity_type text not null,
  difficulty text not null,
  estimated_minutes integer not null,
  completion_criteria text,
  xp_reward integer not null default 10,
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.milestone_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_id uuid not null references public.milestones (id) on delete cascade,
  idempotency_key text not null,
  xp_awarded integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, idempotency_key)
);

create table if not exists public.conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scenario text,
  session_summary text,
  duration_seconds integer,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.conversation_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  message_text text not null,
  message_metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  original_text text not null,
  corrected_text text not null,
  explanation text,
  error_category text,
  occurrence_count integer not null default 1,
  last_seen_at timestamptz not null default timezone('utc', now()),
  mastery_status text not null default 'learning'
);

create table if not exists public.vocabulary_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  word text not null,
  definition text,
  example_sentence text,
  review_interval_days integer not null default 1,
  next_review_at timestamptz,
  successful_reviews integer not null default 0,
  mastery_status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  local_date date not null,
  xp_earned integer not null default 0,
  speaking_minutes integer not null default 0,
  milestones_completed integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, local_date)
);

create index if not exists idx_assessments_user_created on public.assessments (user_id, created_at desc);
create index if not exists idx_milestones_plan on public.milestones (learning_plan_id, status);
create index if not exists idx_messages_session on public.conversation_messages (session_id, created_at);
create index if not exists idx_vocab_review on public.vocabulary_items (user_id, next_review_at);
create index if not exists idx_daily_stats_user_date on public.daily_stats (user_id, local_date desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.learning_plans enable row level security;
alter table public.milestones enable row level security;
alter table public.milestone_completions enable row level security;
alter table public.conversation_sessions enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.mistakes enable row level security;
alter table public.vocabulary_items enable row level security;
alter table public.daily_stats enable row level security;

create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_delete_own on public.profiles for delete using (auth.uid() = id);

create policy assessments_all_own on public.assessments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy learning_plans_all_own on public.learning_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy milestones_all_own on public.milestones for all
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.learning_plans lp
    where lp.id = learning_plan_id and lp.user_id = auth.uid()
  )
);

create policy milestone_completions_all_own on public.milestone_completions for all
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.milestones m
    where m.id = milestone_id and m.user_id = auth.uid()
  )
);

create policy conversation_sessions_all_own on public.conversation_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy conversation_messages_all_own on public.conversation_messages for all
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.conversation_sessions cs
    where cs.id = session_id and cs.user_id = auth.uid()
  )
);

create policy mistakes_all_own on public.mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy vocabulary_all_own on public.vocabulary_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy daily_stats_all_own on public.daily_stats for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = uid;
end;
$$;

grant execute on function public.delete_user_account() to authenticated;
