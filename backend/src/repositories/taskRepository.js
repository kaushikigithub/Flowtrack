const pool = require('../config/db');

async function findByStoryId(storyId, { page = 1, limit = 20, status, priority, assigneeId }) {
  const offset = (page - 1) * limit;

  // Start with the base condition, then dynamically add filters
  const conditions = ['story_id = $1', 'is_deleted = FALSE'];
  const values = [storyId];
  let paramIndex = 2; // $1 is already used by storyId

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }
  if (priority) {
    conditions.push(`priority = $${paramIndex}`);
    values.push(priority);
    paramIndex++;
  }
  if (assigneeId) {
    conditions.push(`assignee_id = $${paramIndex}`);
    values.push(assigneeId);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  // Get the total count (for pagination metadata)
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tasks WHERE ${whereClause}`,
    values
  );
  const totalCount = parseInt(countResult.rows[0].count, 10);

  // Get the actual page of results
  values.push(limit, offset);
  const dataResult = await pool.query(
    `SELECT * FROM tasks
     WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );

  return {
    data: dataResult.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND is_deleted = FALSE',
    [id]
  );
  return result.rows[0];
}

async function create({ storyId, title, description, assigneeId, priority, dueDate }) {
  const result = await pool.query(
    `INSERT INTO tasks (story_id, title, description, assignee_id, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [storyId, title, description, assigneeId, priority || 'medium', dueDate]
  );
  return result.rows[0];
}

async function update(id, { title, description, assigneeId, status, priority, dueDate }) {
  const result = await pool.query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         assignee_id = COALESCE($3, assignee_id),
         status = COALESCE($4, status),
         priority = COALESCE($5, priority),
         due_date = COALESCE($6, due_date),
         updated_at = NOW()
     WHERE id = $7 AND is_deleted = FALSE
     RETURNING *`,
    [title, description, assigneeId, status, priority, dueDate, id]
  );
  return result.rows[0];
}

// SOFT DELETE — sets the flag instead of removing the row
async function softDelete(id) {
  const result = await pool.query(
    `UPDATE tasks SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND is_deleted = FALSE
     RETURNING id`,
    [id]
  );
  return result.rows[0];
}

module.exports = { findByStoryId, findById, create, update, softDelete };