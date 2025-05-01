const { User, Skill, Notification, Class, SPTransaction } = require('../models');
const { Op } = require('sequelize');

exports.saveUserInfo = async (req, res) => {
  const { username, firstName, lastName, age } = req.body;
  const userId = req.user.id;

  try {
    await User.update(
      { username, firstName, lastName, age },
      { where: { id: userId } }
    );
    res.status(200).json({ message: 'User info saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user info.' });
  }
};

exports.addUserSkills = async (req, res) => {
  const { skills } = req.body;
  const user = req.user;

  try {
    const skillRecords = await Promise.all(skills.map(async skillName => {
      return await Skill.findOrCreate({ where: { name: skillName } });
    }));

    await user.setSkills(skillRecords.map(([skill]) => skill));
    res.status(200).json({ message: 'Skills saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save skills.' });
  }
};

exports.completeProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      include: [Skill]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.profileCompleted) {
      return res.status(400).json({ message: 'Profile already completed.' });
    }

    if (!(user.username && user.firstName && user.lastName && user.age)) {
      return res.status(400).json({ message: 'Please complete your personal information first.' });
    }

    if (!user.Skills || user.Skills.length === 0) {
      return res.status(400).json({ message: 'Please select at least one skill.' });
    }

    user.spPoints += 5;
    user.profileCompleted = true;
    await user.save();

    await SPTransaction.create({
      userId: user.id,
      amount: 5,
      type: 'REWARD',
      reason: 'Profile Completion'
    });

    res.status(200).json({ message: 'Profile completed. 5 Swapa Points awarded!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.destroy();

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

exports.getUserCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const courses = await Class.findAll({
      where: {
        [Op.or]: [
          { teacherId: userId },
          { studentId: userId }
        ]
      },
      include: [
        { model: Skill },
        { model: require('../models/User'), as: 'Teacher', attributes: ['id', 'username'] },
        { model: require('../models/User'), as: 'Student', attributes: ['id', 'username'] }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};


exports.getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'age', 'spPoints'],
      include: [
        {
          model: Skill,
          through: { attributes: [] }, // لإزالة بيانات الجدول الوسيط
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    firstName,
    lastName,
    age,
    telegram,
    discord,
    altEmail
  } = req.body;

  try {
    await User.update(
      { username, firstName, lastName, age, telegram, discord, altEmail },
      { where: { id: userId } }
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

