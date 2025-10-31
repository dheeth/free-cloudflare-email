-- Migration 0001 - Initial schema
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    is_admin INTEGER DEFAULT 0,
    is_banned INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create email_addresses table
CREATE TABLE IF NOT EXISTS email_addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    address TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    address_id TEXT NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    headers TEXT,
    raw_email TEXT,
    received_at INTEGER NOT NULL,
    expires_at INTEGER,
    FOREIGN KEY (address_id) REFERENCES email_addresses(id) ON DELETE CASCADE
);

-- Create send_permissions table
CREATE TABLE IF NOT EXISTS send_permissions (
    id TEXT PRIMARY KEY,
    address_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    requested_at INTEGER NOT NULL,
    reviewed_at INTEGER,
    reviewed_by TEXT,
    FOREIGN KEY (address_id) REFERENCES email_addresses(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_addresses_user_id ON email_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_email_addresses_address ON email_addresses(address);
CREATE INDEX IF NOT EXISTS idx_emails_address_id ON emails(address_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_emails_expires_at ON emails(expires_at);
CREATE INDEX IF NOT EXISTS idx_send_permissions_address_id ON send_permissions(address_id);
CREATE INDEX IF NOT EXISTS idx_send_permissions_status ON send_permissions(status);
CREATE INDEX IF NOT EXISTS idx_users_token ON users(token);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);

-- Insert default settings
INSERT INTO settings (key, value, updated_at) VALUES 
    ('email_ttl_days', '30', strftime('%s', 'now')),
    ('domain', 'your-domain.com', strftime('%s', 'now'));

-- Create default admin user (token: admin-secret-token-change-this)
INSERT INTO users (id, token, is_admin, is_banned, created_at, updated_at) VALUES 
    ('admin', 'admin-secret-token-change-this', 1, 0, strftime('%s', 'now'), strftime('%s', 'now'));
