import { Context } from 'hono';
import { Env, User, Variables } from './types';

export async function authenticateUser(c: Context<{ Bindings: Env; Variables: Variables }>): Promise<User | null> {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE token = ? AND is_banned = 0'
    ).bind(token).first<User>();

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function requireAuth(c: Context<{ Bindings: Env; Variables: Variables }>, next: Function) {
  const user = await authenticateUser(c);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  await next();
}

export async function requireAdmin(c: Context<{ Bindings: Env; Variables: Variables }>, next: Function) {
  const user = await authenticateUser(c);
  
  if (!user || !user.is_admin) {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }

  c.set('user', user);
  await next();
}
