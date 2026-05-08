const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../DB/connection");

// Part 1: Posts model using Model.init()
class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
    // Part 1 - Requirement 1: soft delete (paranoid)
    paranoid: true,
  }
);

module.exports = Post;
