const express = require(`express`)
const app = express()
require(`dotenv`).config()
const port = process.env.PORT
const employees = require("./routes/employees")

app.use(express.json())


// Get All Routes
const income = require(`./routes/income`)

app.use(`/income`, income)

app.use("/employees", employees)

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})