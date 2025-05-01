const sequelize = require('../config/db');

const User = require('./User');
const Skill = require('./Skill');
const Class = require('./Class');
const { User, Skill } = require("./User");
User.belongsToMany(Skill, { through: 'User_Skill' });
Skill.belongsToMany(User, { through: 'User_Skill' });

User.hasMany(Class, { as: 'TaughtClasses', foreignKey: 'teacherId' });
User.hasMany(Class, { as: 'AttendedClasses', foreignKey: 'studentId' });
Class.belongsTo(User, { as: 'Teacher', foreignKey: 'teacherId' });
Class.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

Skill.hasMany(Class);
Class.belongsTo(Skill);

module.exports = {
  sequelize,
  User,
  Skill,
  Class,
};


const UserSkill = require('./UserSkill');

User.belongsToMany(Skill, { through: UserSkill });
Skill.belongsToMany(User, { through: UserSkill });
const Request = require("./Request");

// Request relationships
Request.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
Request.belongsTo(User, { as: "Recipient", foreignKey: "recipientId" });
Request.belongsTo(Skill);
User.hasMany(Request, { as: "SentRequests", foreignKey: "senderId" });
User.hasMany(Request, { as: "ReceivedRequests", foreignKey: "recipientId" });
Skill.hasMany(Request)

