const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const checkToken = require("./middleware/checkToken");

const auth = require("./routes/auth");
const income = require("./routes/income");
const employees = require("./routes/employees");
const inventory = require("./routes/inventory");
const bookings = require("./routes/bookings");

const app = express();

// This file is only building the Express app
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/auth", auth);
app.use("/income", checkToken, income);
app.use("/employees", checkToken, employees);
app.use("/inventory", checkToken, inventory);
app.use("/bookings", checkToken, bookings);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

module.exports = app;