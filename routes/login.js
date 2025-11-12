const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Load user data from the JSON file
const usersDataPath = path.join(__dirname, "..", "data", "users.json");
let usersDB;
try {
  const fileData = fs.readFileSync(usersDataPath, "utf-8");
  usersDB = JSON.parse(fileData);
} catch (err) {
  console.error("Failed to load users database:", err);
  usersDB = { users: [] };
}

// POST /login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find a user in the DB with matching email and password
  const user = usersDB.users.find(u => u.email === email && u.password === password);
  if (!user) {
    // Invalid credentials
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // User authenticated: create a JWT token
  const payload = { email: user.email }; // minimal payload (no sensitive data)
  // Sign the token with secret and expiration (e.g., 1 hour)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  
  return res.json({ token });
});

module.exports = router;
