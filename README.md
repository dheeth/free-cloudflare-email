# 📧 Free Cloudflare Email System

A complete email management system built entirely on Cloudflare's free tier. Create unlimited email addresses on your custom domain with a modern web interface and full admin controls.

**Built with:** Cloudflare Workers + D1 Database + Email Routing • **Cost:** $0/month

## Features

- **Custom/Random Email Addresses** - `name@domain.com` or `abc123@domain.com`
- **Receive & Send Emails** - Full functionality (sending requires admin approval)
- **Modern Web UI** - User dashboard + admin panel
- **Token Authentication** - Secure access
- **Admin Controls** - User management, permissions, TTL settings
- **Auto-Cleanup** - Configurable email expiration

## Quick Setup

### 1. Install & Configure

```bash
npm install
npm install -g wrangler
wrangler login
```

### 2. Create Database

```bash
wrangler d1 create email-system-db
```

Update `wrangler.toml` with the database_id and change admin token:

```toml
[[d1_databases]]
database_id = "YOUR_DATABASE_ID_HERE"

[vars]
ADMIN_TOKEN = "your-secure-token"
```

### 3. Deploy

```bash
wrangler d1 execute email-system-db --remote --file=./migrations/0001_initial_schema.sql
wrangler deploy
```

### 4. Configure Email Routing

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → Your Domain → **Email** → **Email Routing**
2. **Enable** and configure MX records
3. **Catch-all** → **Send to Worker** → Select your worker

### 5. Initial Setup

1. Visit your worker URL
2. Login with admin token
3. Update domain in Settings

## Usage

**Register:** Click Register → Create Account → Save token  
**Create Address:** Login → My Addresses → Enter prefix or leave empty  
**Read Emails:** Inbox tab → Select address → Click email  
**Send Emails:** Request permission → Wait for admin approval → Send  
**Admin:** Login with admin token for full management

## API Endpoints

## API Endpoints

```bash
# User
POST /api/user/register
GET  /api/user/me
DELETE /api/user/me

# Addresses
POST /api/addresses/              # Body: {"prefix": "name"} or {}
GET  /api/addresses/
DELETE /api/addresses/:id

# Emails
GET  /api/emails/address/:id
GET  /api/emails/:id
DELETE /api/emails/:id
POST /api/emails/address/:id/request-send
POST /api/emails/send             # Body: {from, to, subject, text}

# Admin (requires admin token)
GET  /api/admin/stats
GET  /api/admin/users
POST /api/admin/users/:id/ban
DELETE /api/admin/users/:id
GET  /api/admin/permissions/pending
POST /api/admin/permissions/:id/approve
PUT  /api/admin/settings/ttl      # Body: {"ttl_days": 30}
PUT  /api/admin/settings/domain   # Body: {"domain": "example.com"}
```

**Authentication:** `Authorization: Bearer YOUR_TOKEN`

**Example:**
```bash
curl -X POST https://your-worker.workers.dev/api/addresses/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prefix": "john"}'
```

## Development

```bash
npm run dev              # Local development
wrangler tail            # View logs
wrangler d1 execute email-system-db --remote --command="SELECT * FROM users"
```

## Troubleshooting

- **Emails not receiving:** Check Email Routing enabled, catch-all configured
- **Can't login:** Verify admin token, clear browser cache
- **TypeScript errors:** Run `npm install`
- **Database errors:** Check database_id in wrangler.toml

## License

MIT
