const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/add", (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: true, message: "Body cannot be empty!" });
    }
    const { name, hours_worked } = req.body;
    if (!name) {
      return res.status(400).json({ error: true, message: "Name cannot be empty!" });
    }

    let statement;
    let result;

    if (hours_worked == null || hours_worked == undefined) {
      statement = "INSERT INTO employees (name) VALUES (?)";
      result = db.prepare(statement).run(name);
    } else {
      statement = "INSERT INTO employees (name, hours_worked) VALUES (?, ?)";
      result = db.prepare(statement).run(name, hours_worked);
    }

    return res.status(200).json({ error: false, result: result });
  } catch (err) {
    next(err);
  }
});

router.get("/getall", (req, res, next) => {
  try {
    const statement = "SELECT * FROM employees";
    const result = db.prepare(statement).all();
    return res.status(200).json({ error: false, result: result });
  } catch (err) {
    next(err);
  }
});

router.get("/get/:id", (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: true,
        message: `id is required in the parameter!`,
      });
    }
    const id = req.params.id;

    const statement = "SELECT * FROM employees WHERE id = ?";
    const result = db.prepare(statement).get(id);
    if (!result) {
      return res.status(404).json({
        error: true,
        message: `no employee was found with id ${id}`,
      });
    } else {
      return res.status(200).json({ error: false, result: result });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/delete", (req, res, next) => {
  try {
    const { id } = req.body || {};

    if (id == null) {
      return res.status(400).json({ error: true, message: "id is required!" });
    }

    const check = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
    if (!check) {
      return res.status(404).json({
        error: true,
        message: `No employee was found with id ${id}`,
      });
    }

    const result = db.prepare("DELETE FROM employees WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(500).json({
        error: true,
        message: `Failed to delete employee with id ${id}`,
      });
    }

    return res.status(200).json({
      error: false,
      message: `Successfully deleted employee with id ${id}`,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/addhours", (req, res, next) => {
  try {
    const { id, hours } = req.body || {};

    if (id == null || hours == null) {
      return res.status(400).json({
        error: true,
        message: "Body must include both id and hours!",
      });
    }

    if (typeof hours !== "number" || hours <= 0) {
      return res.status(400).json({
        error: true,
        message: "Hours must be a positive number!",
      });
    }

    const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
    if (!employee) {
      return res
        .status(404)
        .json({ error: true, message: `No employee found with id ${id}` });
    }

    db.prepare(
      "UPDATE employees SET hours_worked = hours_worked + ? WHERE id = ?"
    ).run(hours, id);

    const updated = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);

    return res.status(200).json({
      error: false,
      message: `Added ${hours} hours to employee ID ${id}`,
      result: updated,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;