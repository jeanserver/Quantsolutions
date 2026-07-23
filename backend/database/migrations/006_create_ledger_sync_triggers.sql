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
