const express = require("express");
const router = express.Router();
const {
  createBulkComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
} = require("./comment.controller");

// GET    /comments/search           — Search comments by word (?word=...)
router.get("/search", searchComments);

// GET    /comments/newest/:postId   — 3 most recent comments for a post
router.get("/newest/:postId", getNewestComments);

// GET    /comments/details/:id      — Get comment by PK with user & post info
router.get("/details/:id", getCommentDetails);

// POST   /comments/find-or-create   — Find or create a comment
router.post("/find-or-create", findOrCreateComment);

// POST   /comments                  — Bulk create comments
router.post("/", createBulkComments);

// PATCH  /comments/:commentId       — Update comment (owner only)
router.patch("/:commentId", updateComment);

module.exports = router;
