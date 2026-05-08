const { Op, ValidationError, UniqueConstraintError } = require("sequelize");
const { User } = require("../../DB/index");

// ── A1: POST /users/signup ────────────────────────────────────
// Create a new user using build() + save()
// Checks email uniqueness before saving; handles validation errors
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Use build() + save() as required
    const user = User.build({ name, email, password, role });
    await user.save();

    return res.status(201).json({ message: "User added successfully." });
  } catch (err) {
    next(err);
  }
};

// ── A2: PUT /users/:id ────────────────────────────────────────
// Create or update based on PK; skip validation option used
const upsertUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // upsert with validate: false to skip validation as required
    await User.upsert(
      { id: parseInt(id), name, email, password, role },
      { validate: false }
    );

    return res.status(200).json({ message: "User created or updated successfully" });
  } catch (err) {
    next(err);
  }
};

// ── A3: GET /users/by-email ───────────────────────────────────
// Find a user by email address from query param
const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// ── A4: GET /users/:id ────────────────────────────────────────
// Retrieve user by PK, excluding the "role" field
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["role", "password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, upsertUser, getUserByEmail, getUserById };
