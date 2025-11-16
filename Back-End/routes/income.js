const express = require(`express`);
const router = express.Router();
const db = require('../db/db')

router.post('/add', (req, res) =>{
  if(!req.body){
    
  }
  const {date, cash = 0, qris = 0, fnb = 0, notes =''} = req.body
})

router.get(`/`, (req, res) => {
  res.json({ kontol: 1000 });
});

router.get("/alltime", (req, res) => {
  res.json({ alltime: "hey" });
});

module.exports = router;
