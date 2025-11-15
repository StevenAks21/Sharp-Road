const express = require(`express`)
const router = express.Router()

router.get(`/`, (req, res) => {
    res.json({ kontol: 1000 })
})

module.exports = router;