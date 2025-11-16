const Database = require("better-sqlite3");
const bcrypt = require(`bcrypt`)
require('dotenv').config()

const db = new Database("SharpRoad.db");

function init() {
  const employeeStatement =
    "CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, hours_worked INTEGER DEFAULT 0)"
  db.prepare(employeeStatement).run();

  const userStatement = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)`
  db.prepare(userStatement).run()

  const countStatement = `SELECT COUNT(*) AS c FROM users`

  const count = db.prepare(countStatement).get().c;

  if (count == 0) {
    console.log(`seeding initial admins... (from db.js)`)
    const password = process.env.ADMIN_PASSWORD
    const hashed = bcrypt.hashSync(password, 10)
    const admin1 = process.env.ADMIN1_USER
    const admin2 = process.env.ADMIN2_USER

    const admins = [
      { username: admin1, password: hashed },
      { username: admin2, password: hashed }
    ]

    const length = admins.length

    const insertStatement = `INSERT INTO users (username, password) VALUES (?, ?)`

    for (let i = 0; i < length; i++) {
      db.prepare(insertStatement).run(admins[i].username, admins[i].password)
    }

  }



}



init();

module.exports = db;
