export interface Env {
  DB: D1Database;
  SEND_EMAIL: any;
  ENVIRONMENT: string;
  ADMIN_TOKEN: string;
}

export interface Variables {
  user: User;
}

export interface User {
  id: string;
  token: string;
  is_admin: number;
  is_banned: number;
  created_at: number;
  updated_at: number;
}

export interface EmailAddress {
  id: string;
  user_id: string;
  address: string;
  created_at: number;
}

export interface Email {
  id: string;
  address_id: string;
  from_address: string;
  to_address: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  headers: string | null;
  raw_email: string | null;
  received_at: number;
  expires_at: number | null;
}

export interface SendPermission {
  id: string;
  address_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: number;
  reviewed_at: number | null;
  reviewed_by: string | null;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: number;
}

export interface AuthContext {
  user: User;
}
