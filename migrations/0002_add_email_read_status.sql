-- Migration 0002 - Add email read status tracking
-- Add is_read column to emails table with default value of 0 (unread)
ALTER TABLE emails ADD COLUMN is_read INTEGER DEFAULT 0;

-- Add read_at timestamp for when the email was marked as read
ALTER TABLE emails ADD COLUMN read_at INTEGER;

-- Mark all existing emails as read
UPDATE emails SET is_read = 1, read_at = strftime('%s', 'now') WHERE is_read = 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);

-- Mark this migration as applied
INSERT OR IGNORE INTO migrations (name, applied_at) VALUES 
    ('0002_add_email_read_status.sql', strftime('%s', 'now'));
