-- =========================================================
-- QuantSolutions Database Schema
-- PostgreSQL 14+
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- Shared trigger function: keep updated_at current on UPDATE
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(255) UNIQUE NOT NULL,
  phone          VARCHAR(30)  NOT NULL,
  address        VARCHAR(255),
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active      BOOLEAN      NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- INVESTMENTS (static plan catalog)
-- =========================================================
CREATE TABLE IF NOT EXISTS investments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(150) NOT NULL,
  category         VARCHAR(100) NOT NULL,
  description      TEXT NOT NULL,
  minimum_amount   NUMERIC(14,2),
  performance_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_investments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  investment_id  UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  status         VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- DEPOSITS
-- =========================================================
CREATE TABLE IF NOT EXISTS deposits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount       NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  method       VARCHAR(50) NOT NULL CHECK (method IN ('bank_transfer', 'wire_transfer', 'check')),
  status       VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reference    VARCHAR(20) UNIQUE NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits (user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits (status);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON deposits (created_at DESC);

DROP TRIGGER IF EXISTS trg_deposits_updated_at ON deposits;
CREATE TRIGGER trg_deposits_updated_at
  BEFORE UPDATE ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- WITHDRAWALS
-- =========================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount          NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  bank_name       VARCHAR(150) NOT NULL,
  account_name    VARCHAR(150) NOT NULL,
  account_number  VARCHAR(60) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reference       VARCHAR(20) UNIQUE NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals (user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals (status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals (created_at DESC);

DROP TRIGGER IF EXISTS trg_withdrawals_updated_at ON withdrawals;
CREATE TRIGGER trg_withdrawals_updated_at
  BEFORE UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- TRANSACTIONS (unified ledger, populated by triggers below)
-- =========================================================
CREATE TABLE IF NOT EXISTS transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  source_id    UUID NOT NULL,
  amount       NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  status       VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  reference    VARCHAR(20) UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);

DROP TRIGGER IF EXISTS trg_transactions_updated_at ON transactions;
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Ledger sync triggers: deposits/withdrawals -> transactions
-- =========================================================

CREATE OR REPLACE FUNCTION sync_deposit_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO transactions (user_id, type, source_id, amount, status, reference, created_at, updated_at)
  VALUES (NEW.user_id, 'deposit', NEW.id, NEW.amount, NEW.status, NEW.reference, NEW.created_at, NEW.updated_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_deposit_insert_sync ON deposits;
CREATE TRIGGER trg_deposit_insert_sync
  AFTER INSERT ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION sync_deposit_insert();

CREATE OR REPLACE FUNCTION sync_deposit_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    UPDATE transactions
    SET status = NEW.status, updated_at = NOW()
    WHERE type = 'deposit' AND source_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_deposit_update_sync ON deposits;
CREATE TRIGGER trg_deposit_update_sync
  AFTER UPDATE ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION sync_deposit_update();

CREATE OR REPLACE FUNCTION sync_withdrawal_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO transactions (user_id, type, source_id, amount, status, reference, created_at, updated_at)
  VALUES (NEW.user_id, 'withdrawal', NEW.id, NEW.amount, NEW.status, NEW.reference, NEW.created_at, NEW.updated_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_withdrawal_insert_sync ON withdrawals;
CREATE TRIGGER trg_withdrawal_insert_sync
  AFTER INSERT ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION sync_withdrawal_insert();

CREATE OR REPLACE FUNCTION sync_withdrawal_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    UPDATE transactions
    SET status = NEW.status, updated_at = NOW()
    WHERE type = 'withdrawal' AND source_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_withdrawal_update_sync ON withdrawals;
CREATE TRIGGER trg_withdrawal_update_sync
  AFTER UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION sync_withdrawal_update();

-- =========================================================
-- Investment plan catalog: tiered Basic/Standard/Advanced/Premium/
-- Institutional structure. Performance fee only — no ROI/return
-- promises are stored or displayed anywhere in this schema.
-- Safe to re-run: replaces the old default catalog exactly once.
-- =========================================================
ALTER TABLE investments
  ADD COLUMN IF NOT EXISTS performance_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0;

ALTER TABLE investments ALTER COLUMN minimum_amount DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM investments WHERE name = 'Managed Portfolio Advisory') THEN
    DELETE FROM investments WHERE name IN (
      'Managed Portfolio Advisory', 'Retirement Planning', 'Fixed Income Strategy',
      'Equity Growth Strategy', 'Institutional Advisory', 'Financial Planning'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM investments WHERE name = 'Basic') THEN
    INSERT INTO investments (name, category, description, minimum_amount, performance_fee_percent) VALUES
    ('Basic', 'Retail', 'An entry-level managed plan for clients starting their investment journey.', 100, 2.00),
    ('Standard', 'Retail', 'A step up in capital allocation with broader strategy access.', 10000, 3.50),
    ('Advanced', 'Growth', 'For clients ready to commit larger capital to more active strategies.', 50000, 5.00),
    ('Premium', 'Growth', 'Our highest retail tier, with priority access and dedicated support.', 250000, 6.50),
    ('Institutional', 'Institutional', 'Custom mandates for institutions, trusts, and endowments. Contact us to discuss terms.', NULL, 7.00);
  END IF;
END $$;

-- =========================================================
-- Crypto deposit/withdrawal method support
-- Safe to re-run: guarded with IF NOT EXISTS / IF EXISTS throughout.
-- =========================================================
ALTER TABLE deposits DROP CONSTRAINT IF EXISTS deposits_method_check;
ALTER TABLE deposits ADD CONSTRAINT deposits_method_check
  CHECK (method IN ('bank_transfer', 'wire_transfer', 'check', 'bitcoin', 'ethereum', 'usdt'));

ALTER TABLE withdrawals
  ADD COLUMN IF NOT EXISTS method VARCHAR(20) NOT NULL DEFAULT 'bank_transfer',
  ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);

ALTER TABLE withdrawals DROP CONSTRAINT IF EXISTS withdrawals_method_check;
ALTER TABLE withdrawals ADD CONSTRAINT withdrawals_method_check
  CHECK (method IN ('bank_transfer', 'bitcoin', 'ethereum', 'usdt'));

ALTER TABLE withdrawals ALTER COLUMN bank_name DROP NOT NULL;
ALTER TABLE withdrawals ALTER COLUMN account_name DROP NOT NULL;
ALTER TABLE withdrawals ALTER COLUMN account_number DROP NOT NULL;

-- =========================================================
-- Client plan selection + admin-managed portfolio value
-- Safe to re-run: guarded with IF NOT EXISTS / IF EXISTS throughout.
-- =========================================================
ALTER TABLE user_investments
  ADD COLUMN IF NOT EXISTS invested_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE user_investments ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE user_investments DROP CONSTRAINT IF EXISTS user_investments_status_check;
ALTER TABLE user_investments ADD CONSTRAINT user_investments_status_check
  CHECK (status IN ('pending', 'active', 'rejected', 'closed'));

-- =========================================================
-- Plan performance entries: real, admin-reported period returns
-- applied in bulk to every active client in a plan tier. Each entry
-- is a record of an actual reported result — not a standing rate.
-- =========================================================
CREATE TABLE IF NOT EXISTS plan_performance_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id    UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  period_label     VARCHAR(50) NOT NULL,
  return_percent   NUMERIC(6,2) NOT NULL,
  accounts_applied INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_performance_investment_id
  ON plan_performance_entries (investment_id);
