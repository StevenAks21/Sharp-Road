const express = require(`express`)
const app = express()
require(`dotenv`).config()
const port = process.env.PORT

// Get All Routes
const income = require(`./routes/income`)

app.use(`/income`, income)

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})