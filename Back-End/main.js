const express = require(`express`)
const app = express()
require(`dotenv`).config()
const port = process.env.PORT


// Get Middleware
app.use(express.json())
const checkToken = require(`./middleware/checkToken`)

// Get All Routes
const employees = require("./routes/employees")
const income = require(`./routes/income`)
const auth = require(`./routes/auth`)

app.use(`/income`, checkToken, income)

app.use(`/login`, auth)

app.use("/employees", checkToken, employees)

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})