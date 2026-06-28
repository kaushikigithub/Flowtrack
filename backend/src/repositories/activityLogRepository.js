const pool = require('../config/db');

async function create({ userId, action, entityType, entityId, details }) {
  const result = await pool.query(
    `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, action, entityType, entityId, details]
  );
  return result.rows[0];
}

async function findRecent(limit = 50) {
  const result = await pool.query(
    `SELECT activity_log.*, users.name AS user_name
     FROM activity_log
     LEFT JOIN users ON activity_log.user_id = users.id
     ORDER BY activity_log.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

module.exports = { create, findRecent };