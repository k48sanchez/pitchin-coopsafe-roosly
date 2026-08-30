-- V2: Bank sync & detection (milestone 2)
-- Categories, Plaid items, bank accounts, raw transactions, detected subscriptions.
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    -- e.g. Streaming, Fitness (seed fills this)
    icon TEXT
);
CREATE TABLE plaid_items (
    -- one per connected bank login
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token_enc TEXT NOT NULL,
    -- Plaid access token, ENCRYPTED at rest
    item_id TEXT NOT NULL UNIQUE,
    institution_name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plaid_item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
    plaid_account_id TEXT NOT NULL,
    name TEXT,
    mask TEXT,
    -- last 4 digits only, never full number
    type TEXT,
    UNIQUE (plaid_item_id, plaid_account_id)
);
CREATE TABLE transactions (
    -- raw pull from Plaid
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    plaid_txn_id TEXT UNIQUE NOT NULL,
    -- Plaid's ID; UNIQUE prevents duplicate imports
    merchant_name TEXT,
    amount_cents BIGINT NOT NULL,
    -- integer cents, never floats
    posted_date DATE NOT NULL,
    raw_description TEXT
);
CREATE TABLE subscriptions (
    -- detected recurring charges (detection job output)
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    -- nullable: may be uncategorized
    merchant_name TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    -- monthly/annual/weekly
    next_charge_date DATE,
    status TEXT NOT NULL DEFAULT 'detected',
    -- detected/confirmed/cancelled
    priority_rank INT,
    -- milestone 3 (drag-to-rank)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_plaid_items_user ON plaid_items(user_id);
CREATE INDEX idx_bank_accts_item ON bank_accounts(plaid_item_id);
CREATE INDEX idx_txn_account_date ON transactions(bank_account_id, posted_date);
CREATE INDEX idx_subs_user_status ON subscriptions(user_id, status);