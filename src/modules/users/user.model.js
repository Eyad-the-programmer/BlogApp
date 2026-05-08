const { DataTypes } = require("sequelize");
const sequelize = require("../../DB/connection");

// Part 1: Users model using sequelize.define()
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Part 1 - Requirement 2: custom validation for password length is on password field
        // checkNameLength is added via beforeCreate hook below
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email already exists." },
      validate: {
        // Part 1 - Requirement 1: built-in email format validation
        isEmail: { msg: "Must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Part 1 - Requirement 2: custom validation method
        checkPasswordLength(value) {
          if (value.length <= 6) {
            throw new Error("Password must be greater than 6 characters");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      // Part 1 - Requirement 3: beforeCreate hook for name length
      beforeCreate(user) {
        if (user.name.length <= 2) {
          throw new Error(
            "checkNameLength: Name must be greater than 2 characters"
          );
        }
      },
    },
  }
);

module.exports = User;
