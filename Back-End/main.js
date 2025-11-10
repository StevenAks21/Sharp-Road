const express = require(`express`)
const app = express()
const port = process.env.PORT

app.get('/hi', (req, res) => {
    res.json({ hi: `hi` })
})

app.listen(port)