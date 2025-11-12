const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// JWT authentication middleware to protect routes
module.exports = function authMiddleware(req, res, next) {
  // Expect the header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  // The authHeader format should be "Bearer token"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid authorization header format" });
  }

  const token = parts[1];
  try {
    // Verify the token using the secret key. Throws error if invalid or expired.
    const decoded = jwt.verify(token, JWT_SECRET);
    // (Optionally, attach decoded user info to request for further use)
    req.user = decoded;
    next(); // token is valid, proceed to the protected route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
