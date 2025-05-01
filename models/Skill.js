const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Import the User model

const Skill = sequelize.define('Skill', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Define the many-to-many relationship between User and Skill
User.belongsToMany(Skill, {
  through: 'User_Skill',
  foreignKey: 'userId',
});
Skill.belongsToMany(User, {
  through: 'User_Skill',
  foreignKey: 'skillId',
});

module.exports = Skill;
