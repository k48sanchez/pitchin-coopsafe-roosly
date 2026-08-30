-- Milestone 2 (Supabase): bank sync & detection.
-- FKs reference auth.users(id) directly. RLS on every user-owned table.
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    icon text
);
create table public.plaid_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    access_token_enc text not null,
    -- ENCRYPTED at rest (app-side)
    item_id text not null unique,
    institution_name text,
    status text not null default 'active',
    created_at timestamptz not null default now()
);
create table public.bank_accounts (
    id uuid primary key default gen_random_uuid(),
    plaid_item_id uuid not null references public.plaid_items(id) on delete cascade,
    plaid_account_id text not null,
    name text,
    mask text,
    type text,
    unique (plaid_item_id, plaid_account_id)
);
create table public.transactions (
    id uuid primary key default gen_random_uuid(),
    bank_account_id uuid not null references public.bank_accounts(id) on delete cascade,
    plaid_txn_id text unique not null,
    merchant_name text,
    amount_cents bigint not null,
    posted_date date not null,
    raw_description text
);
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    category_id uuid references public.categories(id),
    merchant_name text not null,
    amount_cents bigint not null,
    billing_cycle text not null default 'monthly',
    next_charge_date date,
    status text not null default 'detected',
    priority_rank int,
    created_at timestamptz not null default now()
);
create index idx_plaid_items_user on public.plaid_items(user_id);
create index idx_bank_accts_item on public.bank_accounts(plaid_item_id);
create index idx_txn_account_date on public.transactions(bank_account_id, posted_date);
create index idx_subs_user_status on public.subscriptions(user_id, status);
-- ── RLS ──────────────────────────────────────────────────────────
-- categories: reference data, readable by any signed-in user, no writes.
alter table public.categories enable row level security;
create policy "categories_select_all" on public.categories for
select to authenticated using (true);
-- plaid_items: owner-only.
alter table public.plaid_items enable row level security;
create policy "plaid_items_own" on public.plaid_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- bank_accounts: owned via the parent plaid_item.
alter table public.bank_accounts enable row level security;
create policy "bank_accounts_own" on public.bank_accounts for all using (
    exists (
        select 1
        from public.plaid_items pi
        where pi.id = bank_accounts.plaid_item_id
            and pi.user_id = auth.uid()
    )
) with check (
    exists (
        select 1
        from public.plaid_items pi
        where pi.id = bank_accounts.plaid_item_id
            and pi.user_id = auth.uid()
    )
);
-- transactions: owned via bank_account -> plaid_item.
alter table public.transactions enable row level security;
create policy "transactions_own" on public.transactions for all using (
    exists (
        select 1
        from public.bank_accounts ba
            join public.plaid_items pi on pi.id = ba.plaid_item_id
        where ba.id = transactions.bank_account_id
            and pi.user_id = auth.uid()
    )
) with check (
    exists (
        select 1
        from public.bank_accounts ba
            join public.plaid_items pi on pi.id = ba.plaid_item_id
        where ba.id = transactions.bank_account_id
            and pi.user_id = auth.uid()
    )
);
-- subscriptions: owner-only.
alter table public.subscriptions enable row level security;
create policy "subscriptions_own" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);