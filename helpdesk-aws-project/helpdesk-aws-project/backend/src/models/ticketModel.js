const pool = require("../config/db");

async function createTicket({ title, description, priority, projectId, createdBy }) {
  const result = await pool.query(
    `INSERT INTO tickets (title, description, status, priority, project_id, created_by)
     VALUES ($1, $2, 'New', $3, $4, $5)
     RETURNING *`,
    [title, description, priority || "Medium", projectId || null, createdBy]
  );
  return result.rows[0];
}

// Role-based visibility: users see their own tickets, agents see tickets
// assigned to them, admins see everything.
async function listTicketsForUser({ userId, role }) {
  let query, params;

  if (role === "admin") {
    query = `SELECT t.*, u.name AS created_by_name, a.name AS assigned_to_name
              FROM tickets t
              LEFT JOIN users u ON u.user_id = t.created_by
              LEFT JOIN users a ON a.user_id = t.assigned_to
              ORDER BY t.created_at DESC`;
    params = [];
  } else if (role === "agent") {
    query = `SELECT t.*, u.name AS created_by_name
              FROM tickets t
              LEFT JOIN users u ON u.user_id = t.created_by
              WHERE t.assigned_to = $1
              ORDER BY t.created_at DESC`;
    params = [userId];
  } else {
    query = `SELECT * FROM tickets WHERE created_by = $1 ORDER BY created_at DESC`;
    params = [userId];
  }

  const result = await pool.query(query, params);
  return result.rows;
}

async function getTicketById(ticketId) {
  const result = await pool.query("SELECT * FROM tickets WHERE ticket_id = $1", [ticketId]);
  return result.rows[0];
}

async function updateTicket(ticketId, fields) {
  const allowed = ["status", "priority", "assigned_to"];
  const sets = [];
  const values = [];
  let i = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = $${i}`);
      values.push(fields[key]);
      i++;
    }
  }
  if (sets.length === 0) return getTicketById(ticketId);

  values.push(ticketId);
  const result = await pool.query(
    `UPDATE tickets SET ${sets.join(", ")}, updated_at = NOW()
     WHERE ticket_id = $${i} RETURNING *`,
    values
  );
  return result.rows[0];
}

module.exports = { createTicket, listTicketsForUser, getTicketById, updateTicket };
