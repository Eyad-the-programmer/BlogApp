const express = require("express");
const router = express.Router();
const {
  createPost,
  deletePost,
  getPostsWithDetails,
  getPostsWithCommentCount,
} = require("./post.controller");

// GET    /posts/details         — All posts with user & comments info
router.get("/details", getPostsWithDetails);

// GET    /posts/comment-count   — All posts with comment count
router.get("/comment-count", getPostsWithCommentCount);

// POST   /posts                 — Create new post (new instance + save)
router.post("/", createPost);

// DELETE /posts/:postId         — Soft-delete post (owner only)
router.delete("/:postId", deletePost);

module.exports = router;
