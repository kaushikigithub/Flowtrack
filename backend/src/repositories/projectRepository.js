const pool = require('../config/db');

async function findAll() {
  const result = await pool.query(
    'SELECT * FROM projects ORDER BY created_at DESC'
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function create({ name, description, createdBy }) {
  const result = await pool.query(
    `INSERT INTO projects (name, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, createdBy]
  );
  return result.rows[0];
}

async function update(id, { name, description, status }) {
  const result = await pool.query(
    `UPDATE projects
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [name, description, status, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    'DELETE FROM projects WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, create, update, remove };