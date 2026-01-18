// routes/income.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");

function pad(n) {
  return n.toString().padStart(2, "0");
}

// Convert dd-mm-yyyy -> yyyy-mm-dd
function convert(date) {
  const split = date.split("-");
  if (split.length !== 3) return null;
  let [dd, mm, yyyy] = split;
  if (!dd || !mm || !yyyy) return null;
  dd = pad(dd);
  mm = pad(mm);
  return `${yyyy}-${mm}-${dd}`;
}

// Convert yyyy-mm-dd -> dd-mm-yyyy
function toDisplay(date) {
  const split = date.split("-");
  if (split.length !== 3) return date;
  const [yyyy, mm, dd] = split;
  return `${dd}-${mm}-${yyyy}`;
}

// Add income record
router.post("/add", (req, res, next) => {
  try {
  const { date, cash = 0, qris = 0, fnb = 0, notes = "" } = req.body || {};

  if (!date)
    return res.status(400).json({ error: true, message: "Body must include: date, cash, qris, fnb" });

  const cleanDate = convert(date);
  if (!cleanDate) return res.status(400).json({ error: true, message: "Invalid date format! Use dd-mm-yyyy" });

  const total = cash + qris;

  try {
    db.prepare(`INSERT INTO income (date, cash, qris, fnb, total, notes) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(cleanDate, cash, qris, fnb, total, notes);
    return res.status(200).json({ error: false, message: `Successfully added income for ${date}` });
  } catch (e) {
    return res.status(400).json({ error: true, message: e.message });
  }
  } catch (err) {
    next(err);
}
});

// Test route
router.get("/", (req, res, next) => {
  try {
  res.status(200).json({ message: "Income route OK" });
  } catch (err) {
    next(err);
}
});

// All-time income summary
router.get("/alltime", (req, res, next) => {
  try {
  const row = db.prepare(`SELECT SUM(total) AS total_income FROM income`).get();
  const dailyReport = db.prepare(`SELECT * FROM income`).all()
  return res.status(200).json({ error: false, alltime_income: row.total_income, dailyReport: dailyReport });
  } catch (err) {
    next(err);
}
});

router.put(`/daily/`, (req, res, next) => {
  try {
  const { date, cash = 0, qris = 0, fnb = 0, notes = "" } = req.body || {};

  if (!date) {
    return res.status(400).json({ error: true, message: `Date cannot be empty!` });
  }

  const cleanDate = convert(date);
  if (!cleanDate) {
    return res.status(400).json({ error: true, message: `Invalid date format! use dd-mm-yyyy` });
  }

  const result = db.prepare(`SELECT * FROM income WHERE date = ?`).get(cleanDate);

  if (!result) {
    return res.status(404).json({ error: true, message: `No records found for ${date}` });
  }

  const total = qris + cash;

  const updateStatement = `UPDATE income SET cash = ?, qris = ?, fnb = ?, notes = ?, total = ? WHERE date = ?`;

  db.prepare(updateStatement).run(cash, qris, fnb, notes, total, cleanDate);

  return res.status(200).json({ error: false, message: `Successfully changed income statement for ${date}` });
  } catch (err) {
    next(err);
}
});

// Daily income (input & output: dd-mm-yyyy)
router.get(`/daily/:date`, (req, res, next) => {
  try{
  const rawDate = req.params.date;
  if (!rawDate) return res.status(400).json({ error: true, message: `Date cannot be empty!` });

  const cleanDate = convert(rawDate);
  if (!cleanDate) return res.status(400).json({ error: true, message: `Invalid date format! Use dd-mm-yyyy` });

  const result = db.prepare(`SELECT * FROM income WHERE date = ?`).get(cleanDate);

  if (!result) return res.status(404).json({ error: true, message: `No records found for ${rawDate}` });

  result.date = toDisplay(result.date);
  return res.status(200).json({ error: false, result: result });
  } catch (err) {
    next(err);
}
});

// Weekly income (7 days from given date, input/output: dd-mm-yyyy)
router.get(`/weekly`, (req, res, next) => {
  try{
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: true, message: `Date cannot be empty!` });

  const split = date.split("-");
  if (split.length !== 3) return res.status(400).json({ error: true, message: `Invalid date format! Use dd-mm-yyyy` });

  let [dd, mm, yyyy] = split;
  if (!dd || !mm || !yyyy) return res.status(400).json({ error: true, message: `Invalid date format! Use dd-mm-yyyy` });

  dd = pad(dd);
  mm = pad(mm);

  const start = `${yyyy}-${mm}-${dd}`;

  const startObj = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  if (isNaN(startObj)) return res.status(400).json({ error: true, message: `Invalid date value!` });

  const endObj = new Date(startObj);
  endObj.setDate(endObj.getDate() + 6);
  const end = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())}`;

  const totalIncome = db.prepare(`SELECT SUM(total) AS total_income FROM income WHERE date BETWEEN ? AND ?`).get(start, end);

  if (totalIncome.total_income == null) {
    return res
      .status(404)
      .json({ error: true, message: `No data from ${date} to ${toDisplay(end)} is found.` });
  }

  const totalFNB = db.prepare(`SELECT SUM(fnb) AS fnb_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const totalCash = db.prepare(`SELECT SUM(cash) AS cash_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const totalQris = db.prepare(`SELECT SUM(qris) AS qris_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const dailyReport = { daily_report: db.prepare(`SELECT * FROM income WHERE date BETWEEN ? AND ?`).all(start, end) };

  const totalRental = { totalRental: totalIncome.total_income - totalFNB.fnb_total };
  const result = [totalIncome, totalFNB, totalCash, totalQris, totalRental, dailyReport];

  return res.status(200).json({
    error: false,
    start: date,
    end: toDisplay(end),
    result: result
  });
  } catch (err) {
    next(err);
}
});

// Monthly income (month based on provided dd-mm-yyyy, day ignored)
router.get(`/monthly`, (req, res, next) => {
  try {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: true, message: `Date cannot be empty!` });

  const split = date.split("-");
  if (split.length !== 3) return res.status(400).json({ error: true, message: `Invalid date format! Use dd-mm-yyyy` });

  let [dd, mm, yyyy] = split;
  if (!dd || !mm || !yyyy) return res.status(400).json({ error: true, message: `Invalid date format! Use dd-mm-yyyy` });

  mm = pad(mm);

  const start = `${yyyy}-${mm}-01`;
  const endObj = new Date(parseInt(yyyy), parseInt(mm), 0); // last day of that month
  const end = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())}`;

  const totalIncome = db.prepare(`SELECT SUM(total) AS total_income FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const totalFNB = db.prepare(`SELECT SUM(fnb) AS fnb_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const totalCash = db.prepare(`SELECT SUM(cash) AS cash_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const totalQris = db.prepare(`SELECT SUM(qris) AS qris_total FROM income WHERE date BETWEEN ? AND ?`).get(start, end);
  const dailyReport = { daily_report: db.prepare(`SELECT * FROM income WHERE date BETWEEN ? AND ?`).all(start, end) };

  const totalRental = { totalRental: totalIncome.total_income - totalFNB.fnb_total };
  const result = [totalIncome, totalFNB, totalCash, totalQris, totalRental, dailyReport];

  return res.status(200).json({
    error: false,
    start: `01-${mm}-${yyyy}`,
    end: toDisplay(end),
    result: result
  });
  } catch (err) {
    next(err);
}
});

module.exports = router;