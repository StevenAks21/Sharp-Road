const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

function checkToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(403).json({ error: true, message: "Invalid or expired token" });
  }
}

module.exports = checkToken;