const Database = require("better-sqlite3");

const db = new Database("SharpRoad.db");

function init() {
  const statement =
    "CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, hours_worked INTEGER DEFAULT 0)"
  db.prepare(statement).run();
}



init();

module.exports = db;
