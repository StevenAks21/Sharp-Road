const express = require(`express`);
const router = express.Router();
const db = require('../db/db')
router.get(`/`, (req, res) => {
  res.json({ kontol: 1000 });
});

router.get("/alltime", (req, res) => {
  res.json({ alltime: "hey" });
});

module.exports = router;
