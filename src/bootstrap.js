require("dotenv").config();
const express = require("express");
const sequelize = require("./DB/connection");

// Import models + associations (must happen before sync)
require("./DB/index");

// Routers
const userRouter = require("./modules/users/user.router");
const postRouter = require("./modules/posts/post.router");
const commentRouter = require("./modules/comments/comment.router");

// Middleware
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use(globalErrorHandler);

// ── DB sync + server start ────────────────────────────────────
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅  PostgreSQL connected successfully.");

    // alter: true updates table columns without dropping data
    await sequelize.sync({ alter: true });
    console.log("✅  All models synced.");

    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌  Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

start();
