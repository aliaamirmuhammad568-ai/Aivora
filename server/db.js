import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL
export const dbEnabled = Boolean(connectionString)

const pool = dbEnabled
  ? new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  : null

if (dbEnabled) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      name TEXT,
      email TEXT,
      password_hash TEXT,
      avatar TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email)) WHERE email IS NOT NULL;`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reset_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON reset_tokens(user_id);`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_tokens INTEGER NOT NULL DEFAULT 0,
      completion_tokens INTEGER NOT NULL DEFAULT 0,
      total_tokens INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id);`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'New conversation',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      media_mime_type TEXT,
      media_data TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_files_user ON files(user_id);`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);`)
} else {
  console.warn('⚠️  DATABASE_URL not set — auth features (signup/login/OAuth) will return an error until it is configured.')
}

export default pool
