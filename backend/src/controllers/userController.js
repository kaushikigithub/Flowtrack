const pool = require('../config/db');

async function getAll(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll };