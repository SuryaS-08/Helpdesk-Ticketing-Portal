const { listUsers } = require("../models/userModel");

async function getUsers(req, res) {
  try {
    const users = await listUsers();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

module.exports = { getUsers };
