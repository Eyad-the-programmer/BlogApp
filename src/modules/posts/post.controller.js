const { fn, col } = require("sequelize");
const { Post, User, Comment } = require("../../DB/index");

// ── B1: POST /posts ───────────────────────────────────────────
// Create new post using new instance + save()
const createPost = async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({ title, content, userId });
    await post.save();

    return res.status(201).json({ message: "Post created successfully." });
  } catch (err) {
    next(err);
  }
};

// ── B2: DELETE /posts/:postId ─────────────────────────────────
// Soft-delete a post (paranoid). Only the owner can delete.
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    // userId of the person requesting the delete (sent in body or query)
    const { userId } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    // paranoid destroy (soft delete — sets deletedAt timestamp)
    await post.destroy();

    return res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    next(err);
  }
};

// ── B3: GET /posts/details ────────────────────────────────────
// All posts with user (id, name) and comments (id, content)
const getPostsWithDetails = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Comment,
          attributes: ["id", "content"],
        },
      ],
    });

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// ── B4: GET /posts/comment-count ─────────────────────────────
// All posts with a count of their associated comments
const getPostsWithCommentCount = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [fn("COUNT", col("Comments.id")), "commentCount"],
      ],
      include: [
        {
          model: Comment,
          attributes: [],
        },
      ],
      group: ["Post.id"],
    });

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, deletePost, getPostsWithDetails, getPostsWithCommentCount };
