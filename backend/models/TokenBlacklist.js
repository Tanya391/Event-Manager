// models/TokenBlacklist.js
const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// TTL Index: MongoDB will auto-delete documents after expiresAt
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema);