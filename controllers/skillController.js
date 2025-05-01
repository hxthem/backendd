const { Skill, User } = require('../models');
const { Op } = require('sequelize');

exports.addSkill = async (req, res) => {
  try {
    const { name } = req.body;
    let skill = await Skill.findOne({ where: { name } });

    if (!skill) skill = await Skill.create({ name });

    const user = await User.findByPk(req.user.id);
    await user.addSkill(skill);

    res.status(200).json({ message: 'Skill added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findByPk(req.user.id);
    const skill = await Skill.findByPk(skillId);

    await user.removeSkill(skill);
    res.status(200).json({ message: 'Skill removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchSkills = async (req, res) => {
  try {
    const { search } = req.query;

    const skills = await Skill.findAll({
      where: {
        name: {
          [Op.like]: `%${search || ''}%`,
        },
      },
    });

    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
