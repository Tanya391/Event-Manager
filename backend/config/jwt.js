const jwt = require("jsonwebtoken");

module.exports = {
  // Create token for admin login
  generateToken(id) {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token validity
    );
  },

  // Verify token (used inside middleware)
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null; // middleware handles error response
    }
  }
};
