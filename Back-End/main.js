const express = require(`express`)
const app = express()
require(`dotenv`).config()
const cors = require(`cors`)

app.use(cors({
    // origin : process.env.ORIGIN,
    methods: [`GET`, `POST`, `PUT`, `DELETE`],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
const port = process.env.PORT

// Get Middleware
app.use(express.json())
const checkToken = require(`./middleware/checkToken`)

// Health Check End Point
app.get("/health", (req, res) => {
    res.json({ ok: true });
});

// Get All Routes
const employees = require("./routes/employees")
const income = require(`./routes/income`)
const auth = require(`./routes/auth`)
const inventory = require(`./routes/inventory`)

// Routes
app.use(`/income`, checkToken, income)

app.use(`/auth`, auth)

app.use("/employees", checkToken, employees)

app.use(`/inventory`, checkToken, inventory)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Server starts listening
app.listen(port, () => {
    console.log(`listening at port ${port}`)
})