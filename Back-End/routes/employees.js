const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/add", (req, res) => {
  if (!req.body) {
    res.json({ error: true, message: "Body cannot be empty!" })
  }
  const { name, hours_worked } = req.body;
  if (!name) {
    res.json({ error: true, message: "Name cannot be empty!" });
  }

  let statement;
  let result;

  if (hours_worked == null || hours_worked == undefined) {
    statement = "INSERT INTO employees (name) VALUES (?)"
    result = db.prepare(statement).run(name)
  }
  else {
    statement = "INSERT INTO employees (name, hours_worked) VALUES (?, ?)"
    result = db.prepare(statement).run(name, hours_worked)
  }

  res.json({ error: false, result: result })
});

router.get("/getall", (req, res) => {
  const statement = "SELECT * FROM employees"
  const result = db.prepare(statement).all()
  res.json({ error: false, result: result })
})

router.get("/get/:id", (req, res) => {

  if (!req.params.id) {
    res.json({ error: true, message: `id is required in the parameter!` })
  }
  const id = req.params.id


  const statement = "SELECT * FROM employees WHERE id = ?"
  const result = db.prepare(statement).get(id)
  if (!result) {
    res.json({ error: true, message: `no employee was found with id ${id}` })
  }
  else {
    res.json({ error: false, result: result })
  }

})

router.delete('/delete', (req, res) => {
  const { id } = req.body || {};

  if (id == null) {
    return res.json({ error: true, message: "id is required!" });
  }

  const check = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
  if (!check) {
    return res.json({ error: true, message: `No employee was found with id ${id}` });
  }

  const result = db.prepare("DELETE FROM employees WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.json({ error: true, message: `Failed to delete employee with id ${id}` });
  }

  res.json({ error: false, message: `Successfully deleted employee with id ${id}` });
});


module.exports = router;
