const express = require(`express`)
const router = express.Router()
const db = require(`../db/db`)

router.post('/newitem', (req, res) => {

    if (!req.body) {
        return res.json({ error: false, message: `Body cannot be empty` }).status(400)
    }

    const { name, stock = 0 } = req.body

    if (!name) {
        return res.json({ error: true, message: `Body must contain name for the item!` })
    }

    const newItemStatement = `INSERT INTO inventory (name, stock) VALUES (?, ?)`
    const checkStatement = `SELECT * FROM inventory WHERE name = ?`

    const result = db.prepare(checkStatement).get(name)
    if (result) {
        return res.json({ error: true, message: `${name} already exists in the database` }).status(400)
    }
    db.prepare(newItemStatement).run(name, stock)

    return res.json({ error: false, message: `Successfully added ${name} into the database with ${stock} as stock!` })

})

router.get(`/getall`, (req, res) => {
    const getStatement = `SELECT * FROM inventory`
    const result = db.prepare(getStatement).all()

    return res.json({ error: false, message: `Successfully retrieved all stocks`, result: result })
})

router.get(`/get/:id`, (req, res) => {
    const id = req.params.id
    const selectStatement = `SELECT * FROM inventory WHERE id = ?`
    const result = db.prepare(selectStatement).get(id)

    if (!result) {
        return res.json({ error: true, message: `No item was found with id ${id}` }).status(404)
    }

    return res.json({ error: false, message: `Successfully retrieved item with id ${id}`, result: result }).status(200)
})

router.delete(`/delete/:id`, (req, res) => {
    const id = req.params.id
    const checkStatement = `SELECT * FROM inventory WHERE id = ?`
    const result = db.prepare(checkStatement).get(id)
    if (!result) {
        return res.json({ error: true, message: `No item was found with id ${id}` }).status(404)
    }

    const deleteStatement = `DELETE FROM inventory WHERE id = ?`
    db.prepare(deleteStatement).run(id)

    return res.json({ error: false, message: `Successfully deleted item with id ${id}`, item_deleted: result })
})

router.put(`/update/:id`, (req, res) => {
    const id = req.params.id
    const stock = req.body.stock

    if (!req.body.stock) {
        return res.json({ error: true, message: `Stock cannot be empty!` }).status(400)
    }
    const checkStatement = `SELECT * FROM inventory WHERE id = ?`
    const result = db.prepare(checkStatement).get(id)
    if (!result) {
        return res.json({ error: true, message: `No item was found with id ${id}` }).status(404)
    }

    const updateStatement = `UPDATE inventory SET stock = ? WHERE id = ?`
    db.prepare(updateStatement).run(stock, id)
    const newResult = db.prepare(checkStatement).get(id)

    return res.json({ error: false, message: `Successfully updated item ${id}`, oldStock: result, newStock: newResult }).status(200)

})

module.exports = router