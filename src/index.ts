import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env, Variables } from './types';
import { requireAuth, requireAdmin } from './middleware';
import { userRoutes } from './routes/user.js';
import { emailAddressRoutes } from './routes/emailAddress.js';
import { emailRoutes } from './routes/email.js';
import { adminRoutes } from './routes/admin.js';
import { handleIncomingEmail } from './emailHandler.js';
import { serveUI } from './ui.js';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS middleware
app.use('/*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() });
});

// Email webhook handler
app.post('/webhook/email', async (c) => {
  try {
    await handleIncomingEmail(c);
    return c.json({ success: true });
  } catch (error) {
    console.error('Email webhook error:', error);
    return c.json({ error: 'Failed to process email' }, 500);
  }
});

// API routes
app.route('/api/user', userRoutes);
app.route('/api/user/', userRoutes);
app.route('/api/addresses', emailAddressRoutes);
app.route('/api/addresses/', emailAddressRoutes);
app.route('/api/emails', emailRoutes);
app.route('/api/emails/', emailRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/admin/', adminRoutes);

// UI routes
app.get('/', serveUI);
app.get('/*', serveUI);

// Email handler for Cloudflare Email Routing
async function email(message: any, env: Env, ctx: ExecutionContext): Promise<void> {
  try {
    await handleIncomingEmail({ env, message });
  } catch (error) {
    console.error('Email handler error:', error);
  }
}

export default {
  fetch: app.fetch,
  email,
};
