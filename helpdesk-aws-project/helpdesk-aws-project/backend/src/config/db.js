const { Pool } = require("pg");
require("dotenv").config();

// Connection pool to Amazon RDS (PostgreSQL).
// Credentials come from environment variables set on the EC2 instance
// (see backend/deploy/ec2-user-data.sh.tpl), never hard-coded.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Unexpected RDS pool error", err);
});

module.exports = pool;
