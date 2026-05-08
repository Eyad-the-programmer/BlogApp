const express = require("express");
const router = express.Router();
const {
  signup,
  upsertUser,
  getUserByEmail,
  getUserById,
} = require("./user.controller");

// POST   /users/signup       — Create new user (build + save)
router.post("/signup", signup);

// PUT    /users/:id          — Create or update by PK (skip validation)
router.put("/:id", upsertUser);

// GET    /users/by-email     — Find user by email (?email=...)
router.get("/by-email", getUserByEmail);

// GET    /users/:id          — Get user by PK (exclude role)
router.get("/:id", getUserById);

module.exports = router;
