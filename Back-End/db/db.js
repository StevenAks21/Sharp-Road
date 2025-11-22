// db.js
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
require("dotenv").config();

const db = new Database("SharpRoad.db");

// ----------------------
// PAYROLL HELPERS
// ----------------------

function resetMonthlyPay() {
  const stmt = `
    UPDATE employees
    SET 
      total_pay = total_pay + current_pay,
      current_pay = 0,
      hours_worked = 0
  `;
  db.prepare(stmt).run();
}

function checkMonthlyReset() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const thisMonthString = `${year}-${month}`;

  const row = db
    .prepare(`SELECT value FROM metadata WHERE key = 'last_reset'`)
    .get();

  const lastMonthString = row?.value;

  if (lastMonthString !== thisMonthString) {
    console.log("🔄 Running monthly pay reset...");
    resetMonthlyPay();

    db.prepare(
      `
      INSERT INTO metadata (key, value)
      VALUES ('last_reset', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `
    ).run(thisMonthString);
  }
}

// ----------------------
// DB INITIALIZATION
// ----------------------

function init() {

  // Employees table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hours_worked INTEGER DEFAULT 0,
      current_pay INTEGER DEFAULT 0,
      total_pay INTEGER DEFAULT 0
    )
  `).run();

  // Trigger: set current_pay on INSERT
  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS employees_set_current_pay_on_insert
    AFTER INSERT ON employees
    BEGIN
      UPDATE employees
      SET current_pay = NEW.hours_worked * 7000
      WHERE id = NEW.id;
    END;
  `).run();

  // Trigger: update current_pay when hours_worked changes
  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS employees_update_current_pay_on_hours_change
    AFTER UPDATE OF hours_worked ON employees
    BEGIN
      UPDATE employees
      SET current_pay = NEW.hours_worked * 7000
      WHERE id = NEW.id;
    END;
  `).run();

  // Users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `).run();

  // Income table
  // date will be stored as ISO yyyy-mm-dd (no more dd-mm-yyyy inside DB)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS income (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      cash INTEGER DEFAULT 0,
      qris INTEGER DEFAULT 0,
      fnb INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      notes TEXT
    )
  `).run();

  // Inventory table
  db.prepare(`CREATE TABLE IF NOT EXISTS inventory(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    stock INTEGER NOT NULL,
    date_last_restock TEXT)`).run()

  // Metadata table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // Run monthly payroll reset
  checkMonthlyReset();

  // Seed admin users
  const count = db.prepare(`SELECT COUNT(*) AS c FROM users`).get().c;

  if (count === 0) {
    console.log(`Seeding initial admins... (from db.js)`);

    const hashed = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

    const admins = [
      { username: process.env.ADMIN1_USER, password: hashed },
      { username: process.env.ADMIN2_USER, password: hashed }
    ];

    const insertStatement = `INSERT INTO users (username, password) VALUES (?, ?)`;
    admins.forEach(a => db.prepare(insertStatement).run(a.username, a.password));
  }
}

init();

module.exports = db;