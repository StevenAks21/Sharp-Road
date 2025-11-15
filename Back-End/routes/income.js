const express = require(`express`);
const router = express.Router();

router.get(`/`, (req, res) => {
  res.json({ kontol: 1000 });
});

router.get("/alltime", (req, res) => {
  res.json({ alltime: "hey" });
});

module.exports = router;
