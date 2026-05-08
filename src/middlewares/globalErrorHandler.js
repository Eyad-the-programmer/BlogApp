const { ValidationError, UniqueConstraintError } = require("sequelize");

// ── Global Error Handler ──────────────────────────────────────
const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize validation errors 
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages[0] || "Validation error" });
  }

 
  return res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server error" });
};

module.exports = globalErrorHandler;
