const pool = require('../config/db');

async function findByProjectId(projectId) {
  const result = await pool.query(
    'SELECT * FROM stories WHERE project_id = $1 ORDER BY created_at DESC',
    [projectId]
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
  return result.rows[0];
}

async function create({ projectId, title, description, priority }) {
  const result = await pool.query(
    `INSERT INTO stories (project_id, title, description, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [projectId, title, description, priority || 'medium']
  );
  return result.rows[0];
}

async function update(id, { title, description, priority, status }) {
  const result = await pool.query(
    `UPDATE stories
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         priority = COALESCE($3, priority),
         status = COALESCE($4, status),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title, description, priority, status, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query('DELETE FROM stories WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}

module.exports = { findByProjectId, findById, create, update, remove };