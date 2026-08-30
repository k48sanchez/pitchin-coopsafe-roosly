-- Milestone 3 (Supabase): budgets, priority index, dashboard view.
create table public.budgets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    monthly_limit_cents bigint not null,
    period_start date not null,
    created_at timestamptz not null default now(),
    unique (user_id, period_start)
);
create index idx_subs_user_priority on public.subscriptions(user_id, priority_rank);
alter table public.budgets enable row level security;
create policy "budgets_own" on public.budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Dashboard aggregate. security_invoker makes the view respect the querying
-- user's RLS, so each user only aggregates their own subscriptions.
create view public.user_subscription_summary with (security_invoker = true) as
select user_id,
    count(*) as active_subscription_count,
    coalesce(sum(amount_cents), 0) as monthly_total_cents
from public.subscriptions
where status in ('detected', 'confirmed')
group by user_id;