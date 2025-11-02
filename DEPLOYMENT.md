# Deployment Guide

## Quick Start Deployment

### 1. Prerequisites Check
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Node.js installed (v18+)
- [ ] Wrangler CLI installed globally
- [ ] `npm install` completed

### 2. Automated Setup (Recommended)

The easiest way to set up everything in one go:

```bash
npm run setup
```

This interactive script will:
1. Authenticate with Cloudflare
2. Create the D1 database
3. Run all migrations automatically
4. Configure admin token
5. Deploy to Workers
6. Guide you through email routing setup

### 3. Manual Setup (Alternative)

If you prefer to do things step by step:

\`\`\`bash
# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create email-system-db
\`\`\`

### 3. Configuration (2 minutes)

Copy the database ID from the previous step and update \`wrangler.toml\`:

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "email-system-db"
database_id = "paste-your-database-id-here"
\`\`\`

Update admin token (choose a strong token):

\`\`\`toml
[vars]
ADMIN_TOKEN = "your-super-secure-token-123456"
\`\`\`

### 4. Database Setup (2 minutes)

\`\`\`bash
# Run all pending migrations automatically
npm run migrate              # for development database
npm run migrate:remote       # for production database
\`\`\`

The migration runner will:
- ✅ Detect which migrations have already been applied
- ✅ Run only pending migrations in order
- ✅ Track applied migrations in the database
- ✅ Show progress and any errors

The first run will initialize the database schema (migration 0001) and any pending migrations (0002, etc).

### 4.1 Manual Migration (Alternative)

If you prefer manual control:

\`\`\`bash
# Run specific migration
wrangler d1 execute email-system-db --remote --file=./migrations/0002_add_email_read_status.sql
\`\`\`

### 5. Deploy (1 minute)

\`\`\`bash
# Deploy to Cloudflare Workers
wrangler deploy
\`\`\`

Note the URL provided (e.g., \`https://free-cloudflare-email.your-subdomain.workers.dev\`)

### 6. Configure Email Routing (5 minutes)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Click **Email** → **Email Routing**
4. Click **Enable Email Routing**
5. Follow the wizard to configure MX records (automatic)
6. Add **Catch-all address**:
   - Click "Edit" on Catch-all
   - Action: **Send to a Worker**
   - Destination: Select **free-cloudflare-email**
   - Save

### 7. Initial Configuration (3 minutes)

1. Visit your worker URL
2. Login with admin token
3. Go to **Settings** tab
4. Update **Domain** to your actual domain (e.g., \`example.com\`)
5. Set **TTL** as desired (default 30 days is fine)

### 8. Test (2 minutes)

1. **Create test user**:
   - Logout
   - Click Register
   - Save the token

2. **Create email address**:
   - Login with user token
   - Create an address (e.g., \`test@yourdomain.com\`)

3. **Send test email**:
   - From Gmail/any email, send to \`test@yourdomain.com\`
   - Wait ~30 seconds
   - Check Inbox tab - email should appear!

## Production Deployment Checklist

### Security
- [ ] Changed admin token to strong, unique value
- [ ] Updated admin token in database
- [ ] Configured custom domain (not workers.dev subdomain)
- [ ] Set up Cloudflare Access for additional security (optional)

### Email Configuration
- [ ] Email routing enabled
- [ ] MX records configured
- [ ] Catch-all route pointing to worker
- [ ] SPF/DKIM records configured (for sending)

### Database
- [ ] Migrations applied to production database
- [ ] Domain setting updated in database
- [ ] TTL configured appropriately

### Testing
- [ ] Test email receiving
- [ ] Test user registration
- [ ] Test email address creation
- [ ] Test admin panel access
- [ ] Test send permission workflow

### Monitoring
- [ ] Set up Cloudflare Analytics
- [ ] Monitor worker errors: \`wrangler tail\`
- [ ] Set up alerts for quota usage

## Custom Domain Setup

To use your own domain instead of workers.dev:

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click your worker (**free-cloudflare-email**)
3. Go to **Settings** → **Triggers**
4. Add **Custom Domain**: \`email.yourdomain.com\`
5. Wait for SSL certificate provisioning (~2 minutes)
6. Access via \`https://email.yourdomain.com\`

## Environment Variables

For production, consider using Wrangler secrets:

\`\`\`bash
# Set admin token as secret
echo "your-super-secure-token" | wrangler secret put ADMIN_TOKEN
\`\`\`

## Updating the System

\`\`\`bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Deploy updates
wrangler deploy
\`\`\`

## Rollback

If deployment fails:

\`\`\`bash
# View previous deployments
wrangler deployments list

# Rollback to specific deployment
wrangler rollback [deployment-id]
\`\`\`

## Monitoring and Logs

\`\`\`bash
# View real-time logs
wrangler tail

# View logs for specific deployment
wrangler tail --format json
\`\`\`

## Database Management

\`\`\`bash
# Execute SQL query
wrangler d1 execute email-system-db --remote --command="SELECT COUNT(*) FROM users"

# Backup database (export)
wrangler d1 export email-system-db --remote --output=backup.sql

# View database info
wrangler d1 info email-system-db
\`\`\`

## Scaling Considerations

The free tier provides:
- **100,000 requests/day** (Workers)
- **5 million reads/day** (D1)
- **100 emails/day** (Email sending)

For higher limits:
1. Upgrade to Workers Paid ($5/month)
   - 10 million requests/month included
   - $0.50 per additional million

2. D1 automatically scales with Workers plan

## Troubleshooting Deployment

### "Database not found"
\`\`\`bash
# List databases
wrangler d1 list

# Verify database_id in wrangler.toml matches
\`\`\`

### "Unauthorized" errors
\`\`\`bash
# Re-authenticate
wrangler logout
wrangler login
\`\`\`

### Email routing not working
1. Check MX records are correct
2. Verify catch-all is enabled
3. Check worker is deployed successfully
4. Review worker logs: \`wrangler tail\`

### Migration-related issues

**Check migration status:**
\`\`\`bash
# See which migrations have been applied
npm run migrate

# For production
npm run migrate:remote
\`\`\`

**If migrations fail:**
\`\`\`bash
# Check if migrations table exists
wrangler d1 execute email-system-db --remote --command="SELECT * FROM migrations"

# If table doesn't exist, run initial migration first
npm run migrate:remote

# See which migrations were applied
wrangler d1 execute email-system-db --remote --command="SELECT name, applied_at FROM migrations ORDER BY applied_at"
\`\`\`

**If a specific migration fails:**
1. Check the error message
2. Ensure database_id is correct in wrangler.toml
3. Verify you have permissions to modify the database
4. Check if columns already exist (idempotent migrations use IF NOT EXISTS)

### Migration errors
\`\`\`bash
# Check if migrations already applied
wrangler d1 execute email-system-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"

# If tables exist, migrations already applied

# Check if migration 0002 was applied
wrangler d1 execute email-system-db --remote --command="PRAGMA table_info(emails)"

# If you see is_read and read_at columns, migration 0002 is already applied
\`\`\`

### Applying New Migrations

To apply a new migration to your production database:

\`\`\`bash
# Step 1: Pull latest code
git pull

# Step 2: Verify the migration file exists
ls migrations/

# Step 3: Apply the migration to production
wrangler d1 execute email-system-db --remote --file=./migrations/0002_add_email_read_status.sql

# Step 4: Verify the migration succeeded
wrangler d1 execute email-system-db --remote --command="PRAGMA table_info(emails)"

# Step 5: Deploy the worker code
wrangler deploy
\`\`\`

**Note:** Migration 0002 automatically marks all existing emails as read. This ensures a smooth transition with no unread notifications.

## Support

For deployment issues:
1. Check \`wrangler tail\` for errors
2. Review Cloudflare Dashboard → Workers → Logs
3. Verify all configuration steps completed
4. Check GitHub issues for similar problems

---

**Estimated Total Deployment Time: ~20 minutes**
