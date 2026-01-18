const express = require(`express`)
const router = express.Router()
const db = require(`../db/db`)

// Create new item
router.post('/newitem', (req, res, next) => {
    try {

    if (!req.body) {
        return res.status(400).json({ error: true, message: `Body cannot be empty` })
    }

    const { name, stock = 0 } = req.body

    if (!name) {
        return res.status(400).json({ error: true, message: `Body must contain name for the item!` })
    }

    const checkStatement = `SELECT * FROM inventory WHERE name = ?`
    const newItemStatement = `INSERT INTO inventory (name, stock) VALUES (?, ?)`

    const result = db.prepare(checkStatement).get(name)

    if (result) {
        return res.status(400).json({ error: true, message: `${name} already exists in the database` })
    }

    db.prepare(newItemStatement).run(name, stock)

    return res.status(201).json({
        error: false,
        message: `Successfully added ${name} into the database with ${stock} as stock!`
    })
    } catch (err) {
    next(err);
}

});

// Get all items
router.get(`/getall`, (req, res, next) => {
    try {
    const getStatement = `SELECT * FROM inventory`
    const result = db.prepare(getStatement).all()

    return res.status(200).json({
        error: false,
        message: `Successfully retrieved all stocks`,
        result
    })
    } catch (err) {
    next(err);
}
});

// Get item by ID
router.get(`/get/:id`, (req, res, next) => {
    try {
    const id = req.params.id
    const selectStatement = `SELECT * FROM inventory WHERE id = ?`

    const result = db.prepare(selectStatement).get(id)

    if (!result) {
        return res.status(404).json({ error: true, message: `No item was found with id ${id}` })
    }

    return res.status(200).json({
        error: false,
        message: `Successfully retrieved item with id ${id}`,
        result
    })
    } catch (err) {
    next(err);
}
});

// Delete item
router.delete(`/delete/:id`, (req, res, next) => {
    try {
    const id = req.params.id
    const checkStatement = `SELECT * FROM inventory WHERE id = ?`

    const result = db.prepare(checkStatement).get(id)

    if (!result) {
        return res.status(404).json({ error: true, message: `No item was found with id ${id}` })
    }

    const deleteStatement = `DELETE FROM inventory WHERE id = ?`
    db.prepare(deleteStatement).run(id)

    return res.status(200).json({
        error: false,
        message: `Successfully deleted item with id ${id}`,
        item_deleted: result
    })
    } catch (err) {
    next(err);
}
});

// Update stock
router.put(`/update/:id`, (req, res, next) => {
    try {
    const id = req.params.id
    const stock = req.body.stock

    if (stock == null) {
        return res.status(400).json({ error: true, message: `Stock cannot be empty!` })
    }

    const checkStatement = `SELECT * FROM inventory WHERE id = ?`
    const result = db.prepare(checkStatement).get(id)

    if (!result) {
        return res.status(404).json({ error: true, message: `No item was found with id ${id}` })
    }

    const updateStatement = `UPDATE inventory SET stock = ? WHERE id = ?`
    db.prepare(updateStatement).run(stock, id)

    const newResult = db.prepare(checkStatement).get(id)

    return res.status(200).json({
        error: false,
        message: `Successfully updated item ${id}`,
        oldStock: result,
        newStock: newResult
    })
    } catch (err) {
    next(err);
}
});

module.exports = router