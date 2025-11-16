const express = require(`express`)
const router = express.Router()
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`)
const db = require(`../db/db`)
require(`dotenv`).config()
const secret = process.env.JWT_SECRET

router.post("/", (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: true, message: "Body cannot be empty, must contain username and password" });
    }

    const { username, password } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
        return res.status(404).json({ error: true, message: `No user was found with username ${username}` });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: true, message: `Password for ${username} is incorrect` });
    }

    const token = jwt.sign({ id: user.id, username }, secret, { expiresIn: "1d" });
    return res.status(200).json({
        error: false,
        message: `Successfully logged in as ${username}`,
        token,
    });
});

router.get("/whoami", (req, res) => {
    const auth = req.headers.authorization?.split(" ")[1];
    if (!auth) return res.status(401).json({ error: true, message: "No token provided" });

    try {
        const decoded = jwt.verify(auth, secret);
        res.status(200).json({
            error: false,
            message: "Token valid",
            user: decoded
        });
    } catch {
        res.status(403).json({ error: true, message: "Invalid or expired token" });
    }
});
module.exports = router