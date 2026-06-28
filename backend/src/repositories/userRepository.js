const pool = require('../config/db');

// Find a user by their email — used during login and registration checks
async function findByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0]; // returns undefined if no user found
}

// Find a user by their ID — used after verifying a JWT token
async function findById(id) {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// Create a new user — called during registration
async function createUser({ name, email, passwordHash, role }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
}

module.exports = { findByEmail, findById, createUser };