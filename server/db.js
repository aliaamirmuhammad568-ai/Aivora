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
} else {
  console.warn('⚠️  DATABASE_URL not set — auth features (signup/login/OAuth) will return an error until it is configured.')
}

export default pool
