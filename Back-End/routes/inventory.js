const express = require(`express`)
const router = express.Router()
const db = require(`../db/db`)

router.get(`/`, (req, res) => {
    res.json({hey:`hi`}).status(200)
})

module.exports = router