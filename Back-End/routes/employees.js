const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/add", (req, res) => {
  const { name, hours_worked } = req.body;
  if (!name) {
    res.json({ error: true, message: "Name cannot be empty!" });
  }
  const statement = "INSERT INTO employees (name, hours_worked) VALUES (?, ?)"

  const result = db.prepare(statement)
});

module.exports = router;
