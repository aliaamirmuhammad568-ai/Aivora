import pool from './db.js'

export async function logUsage(userId, { promptTokens = 0, completionTokens = 0, totalTokens = 0 }) {
  await pool.query(
    `INSERT INTO usage_logs (user_id, prompt_tokens, completion_tokens, total_tokens) VALUES ($1, $2, $3, $4)`,
    [userId, promptTokens, completionTokens, totalTokens],
  )
}

export async function getUsageStats(userId) {
  const { rows: totalsRows } = await pool.query(
    `SELECT count(*)::int AS messages_used, COALESCE(sum(total_tokens), 0)::int AS tokens_used
     FROM usage_logs WHERE user_id = $1`,
    [userId],
  )
  const totals = totalsRows[0] || { messages_used: 0, tokens_used: 0 }

  const { rows: monthlyRows } = await pool.query(
    `SELECT to_char(date_trunc('month', created_at), 'Mon') AS month,
            date_trunc('month', created_at) AS month_start,
            count(*)::int AS value
     FROM usage_logs
     WHERE user_id = $1 AND created_at >= now() - interval '6 months'
     GROUP BY month_start, month
     ORDER BY month_start ASC`,
    [userId],
  )

  return {
    messagesUsed: totals.messages_used,
    tokensUsed: totals.tokens_used,
    monthly: monthlyRows.map((r) => ({ month: r.month, value: r.value })),
  }
}
