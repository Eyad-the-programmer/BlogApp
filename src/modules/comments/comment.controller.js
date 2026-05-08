const { Op } = require("sequelize");
const { Comment, User, Post } = require("../../DB/index");

// ── C1: POST /comments ────────────────────────────────────────
// Create a bulk of comments from array in body
const createBulkComments = async (req, res, next) => {
  try {
    const { comments } = req.body;

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ message: "comments array is required" });
    }

    await Comment.bulkCreate(comments, { validate: true });

    return res.status(201).json({ messaeg: "comments created." });
  } catch (err) {
    next(err);
  }
};

// ── C2: PATCH /comments/:commentId ───────────────────────────
// Update content of a specific comment — only the owner can do this
const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "comment not found." });
    }

    if (comment.userId !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment." });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: "Comment updated." });
  } catch (err) {
    next(err);
  }
};

// ── C3: POST /comments/find-or-create ────────────────────────
// Find a comment by postId, userId, content — or create it
const findOrCreateComment = async (req, res, next) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content },
    });

    return res.status(200).json({ comment, created });
  } catch (err) {
    next(err);
  }
};

// ── C4: GET /comments/search ─────────────────────────────────
// Find & count comments that contain a specific word
const searchComments = async (req, res, next) => {
  try {
    const { word } = req.query;

    if (!word) {
      return res.status(400).json({ message: "word query parameter is required" });
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        content: { [Op.iLike]: `%${word}%` }, // iLike = case-insensitive in Postgres got some help from ai obviouslyyy
      },
    });

    if (count === 0) {
      return res.status(404).json({ message: "no comments found." });
    }

    return res.status(200).json({ count, comments: rows });
  } catch (err) {
    next(err);
  }
};

// ── C5: GET /comments/newest/:postId ─────────────────────────
// 3 most recent comments for a specific post 7aseb
const getNewestComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
      attributes: ["id", "content", "createdAt"],
    });

    if (!comments.length) {
      return res.status(404).json({ message: "no comments found for this post." });
    }

    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// ── C6: GET /comments/details/:id ────────────────────────────
// Get a specific comment by PK, including user and post information
const getCommentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Post,
          attributes: ["id", "title", "content"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "no comment found" });
    }

    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBulkComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
};
