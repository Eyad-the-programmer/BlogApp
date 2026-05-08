// Central place to import all models and define associations
const User = require("../modules/users/user.model");
const Post = require("../modules/posts/post.model");
const Comment = require("../modules/comments/comment.model");

// ── Associations ──────────────────────────────────────────────

// User -> Posts  (one-to-many)
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

// Post -> Comments (one-to-many)
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// User -> Comments (one-to-many)
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Post, Comment };
