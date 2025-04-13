const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures the email is in a valid format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Ensures password is required
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null after verification
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null after password reset
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: "local", // Default to local authentication
  },
});

module.exports = User;