const { User, Skill } = require('../models');
const { Op } = require('sequelize');

exports.searchBySkill = async (req, res) => {
  const search = req.query.skill;

  try {
    const skills = await Skill.findAll({
      where: {
        name: { [Op.like]: `%${search}%` }
      },
      include: {
        model: User,
        through: { attributes: [] },
        attributes: ['id', 'username', 'firstName', 'lastName'] // أضف rating, experience إن توفرت
      }
    });

    const users = [];
    skills.forEach(skill => {
      skill.Users.forEach(user => {
        const existing = users.find(u => u.id === user.id);
        if (!existing) {
          users.push({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            skills: [skill.name],
          });
        } else {
          existing.skills.push(skill.name);
        }
      });
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
