const express = require("express");
const cors = require("cors");
require("dotenv").config();

const checkToken = require("./middleware/checkToken");

const employees = require("./routes/employees");
const income = require("./routes/income");
const auth = require("./routes/auth");
const inventory = require("./routes/inventory");
const bookings = require(`./routes/bookings`)

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/income", checkToken, income);
app.use("/auth", auth);
app.use("/employees", checkToken, employees);
app.use("/inventory", checkToken, inventory);
app.use("/bookings", checkToken, bookings)


app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

module.exports = app;