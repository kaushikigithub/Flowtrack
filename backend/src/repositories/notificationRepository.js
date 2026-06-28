const pool = require('../config/db');

// Find tasks due today that aren't done yet, and aren't already notified
async function findTasksDueToday() {
  const result = await pool.query(`
    SELECT tasks.id, tasks.title, tasks.due_date, tasks.assignee_id
    FROM tasks
    WHERE tasks.due_date = CURRENT_DATE
      AND tasks.status != 'done'
      AND tasks.is_deleted = FALSE
      AND tasks.assignee_id IS NOT NULL
  `);
  return result.rows;
}

async function createNotification({ userId, message }) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, message)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, message]
  );
  return result.rows[0];
}

async function findByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function markAsRead(id, userId) {
  const result = await pool.query(
    `UPDATE notifications SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

module.exports = { findTasksDueToday, createNotification, findByUserId, markAsRead };