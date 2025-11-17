// routes/income.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");


// Add income record
router.post("/add", (req, res) => {
  const { date, cash = 0, qris = 0, fnb = 0, notes = "" } = req.body || {};

  if (!date) {
    return res.status(400).json({
      error: true,
      message: "Body must include: date, cash, qris, fnb"
    });
  }

  const total = cash + qris + fnb;

  const insertStatement = `
    INSERT INTO income (date, cash, qris, fnb, total, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    db.prepare(insertStatement).run(date, cash, qris, fnb, total, notes);

    return res.status(200).json({
      error: false,
      message: `Successfully added income for ${date}`
    });
  } catch (e) {
    return res.status(400).json({
      error: true,
      message: e.message
    });
  }
});


// Test route
router.get("/", (req, res) => {
  res.json({ message: "Income route OK" });
});


// All-time income summary
router.get("/alltime", (req, res) => {
  const row = db.prepare(`
    SELECT SUM(total) AS total_income FROM income
  `).get();

  return res.json({
    error: false,
    alltime_income: row.total_income || 0
  }).status(200);
});

//Daily income
router.get(`/daily/:date`, (req, res) => {
  if (!req.params.date || !req.params) {
    return res.json({ error: true, message: `Date cannot be empty!` }).status(400)
  }

  const date = req.params.date

  const dailyStatement = `SELECT * FROM income WHERE date = ?`
  const result = db.prepare(dailyStatement).get(date)

  if (!result) {
    return res.json({ error: true, message: `Cannot find records for ${date}` }).status(400)
  }

  return res.json({ error: false, result: result }).status(200)
})

module.exports = router;