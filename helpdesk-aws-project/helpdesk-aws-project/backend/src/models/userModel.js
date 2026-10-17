const pool = require("../config/db");

async function createUser({ name, email, passwordHash, role }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role, created_at`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function findUserById(userId) {
  const result = await pool.query(
    "SELECT user_id, name, email, role, created_at FROM users WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
}

async function listUsers() {
  const result = await pool.query(
    "SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
}

module.exports = { createUser, findUserByEmail, findUserById, listUsers };
