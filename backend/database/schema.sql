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
  minimum_amount   NUMERIC(14,2) NOT NULL,
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
-- Seed default investment plan catalog if empty
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM investments) THEN
    INSERT INTO investments (name, category, description, minimum_amount) VALUES
    ('Managed Portfolio Advisory', 'Advisory', 'A professionally managed, diversified portfolio built around your risk profile and goals.', 5000),
    ('Retirement Planning', 'Planning', 'Long-term planning for sustainable retirement income with tax-aware strategies.', 2500),
    ('Fixed Income Strategy', 'Fixed Income', 'Capital-preservation-focused strategy using government and investment-grade bonds.', 10000),
    ('Equity Growth Strategy', 'Equity', 'Long-term equity strategy focused on fundamentally strong, diversified businesses.', 7500),
    ('Institutional Advisory', 'Institutional', 'Dedicated advisory mandate for institutions, trusts, and endowments.', 50000),
    ('Financial Planning', 'Planning', 'Holistic financial planning covering budgeting, education, and estate coordination.', 1000);
  END IF;
END $$;
