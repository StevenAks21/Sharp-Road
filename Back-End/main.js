const express = require(`express`)
const app = express()
require(`dotenv`).config()
const cors = require(`cors`)

app.use(cors({
    origin : process.env.ORIGIN,
    methods: [`GET`, `POST`, `PUT`, `DELETE`],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
const port = process.env.PORT


// Get Middleware
app.use(express.json())
const checkToken = require(`./middleware/checkToken`)


// Get All Routes
const employees = require("./routes/employees")
const income = require(`./routes/income`)
const auth = require(`./routes/auth`)
const inventory = require(`./routes/inventory`)

app.use(`/income`, checkToken, income)

app.use(`/auth`, auth)

app.use("/employees", checkToken, employees)

app.use(`/inventory`, checkToken, inventory)

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})