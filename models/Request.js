const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Request = sequelize.define("Request", {
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }
});

module.exports = Request;
