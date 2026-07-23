-- =========================================================
-- QuantSolutions Seed Data
-- Run only in development/staging environments.
-- Passwords below are for seeded test accounts only.
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin account: admin@quantsolutions.com / AdminPass123!
INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
SELECT 'Alexandra', 'Reyes', 'admin@quantsolutions.com', '+18005550101',
       crypt('AdminPass123!', gen_salt('bf', 12)), 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@quantsolutions.com'
);

-- Demo client account: client@quantsolutions.com / ClientPass123!
INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
SELECT 'Jordan', 'Mitchell', 'client@quantsolutions.com', '+18005550102',
       crypt('ClientPass123!', gen_salt('bf', 12)), 'user'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'client@quantsolutions.com'
);

-- Sample pending deposit request for the demo client
INSERT INTO deposits (user_id, amount, method, status, reference, notes)
SELECT id, 5000.00, 'bank_transfer', 'pending', 'DEP-A1B2C3D4', 'Initial funding for managed portfolio.'
FROM users
WHERE email = 'client@quantsolutions.com'
  AND NOT EXISTS (SELECT 1 FROM deposits WHERE reference = 'DEP-A1B2C3D4');

-- Sample approved deposit for the demo client
INSERT INTO deposits (user_id, amount, method, status, reference, notes)
SELECT id, 2500.00, 'wire_transfer', 'approved', 'DEP-E5F6G7H8', 'Second contribution, wire confirmed.'
FROM users
WHERE email = 'client@quantsolutions.com'
  AND NOT EXISTS (SELECT 1 FROM deposits WHERE reference = 'DEP-E5F6G7H8');

-- Sample pending withdrawal request for the demo client
INSERT INTO withdrawals (user_id, amount, bank_name, account_name, account_number, status, reference, notes)
SELECT id, 750.00, 'Chase Bank', 'Jordan Mitchell', '000123456789', 'pending', 'WDR-J9K0L1M2', 'Partial withdrawal request.'
FROM users
WHERE email = 'client@quantsolutions.com'
  AND NOT EXISTS (SELECT 1 FROM withdrawals WHERE reference = 'WDR-J9K0L1M2');

-- Note: rows inserted into "transactions" are populated automatically
-- by the ledger sync triggers defined in schema.sql — no manual insert
-- into transactions is needed or should be performed.
