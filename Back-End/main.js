const express = require(`express`)
const app = express()
require(`dotenv`).config()
const port = process.env.PORT

app.get('/hi', (req, res) => {
    res.json({ hi: `hi` })
})

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})