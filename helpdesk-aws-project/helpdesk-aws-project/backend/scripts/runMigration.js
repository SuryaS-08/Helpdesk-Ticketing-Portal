// Applies every .sql file in /migrations, in filename order, against RDS.
// Usage: npm run migrate   (reads DB_* vars from .env)
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

async function run() {
  const dir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    console.log(`Applying ${file} ...`);
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    await pool.query(sql);
  }

  console.log("Migrations complete.");
  await pool.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
