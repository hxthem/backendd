const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserSkill = sequelize.define('User_Skill', {
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  teachingHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = UserSkill;
