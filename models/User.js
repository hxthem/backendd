const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: "local",
  },
  username: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  age: DataTypes.INTEGER,
  googleId: DataTypes.STRING,
  facebookId: DataTypes.STRING,

  // ✅ New fields
  spPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  profileCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
  ,
telegram: DataTypes.STRING,
discord: DataTypes.STRING,
altEmail: DataTypes.STRING,

});

module.exports = User;

const Skill = require('./Skill');
User.belongsToMany(Skill, { through: 'User_Skill' });
Skill.belongsToMany(User, { through: 'User_Skill' });
const Notification = require('./Notification');

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });
User.belongsToMany(Skill, {
  through: 'User_Skill',
  foreignKey: 'userId',
});
Skill.belongsToMany(User, {
  through: 'User_Skill',
  foreignKey: 'skillId',
});


