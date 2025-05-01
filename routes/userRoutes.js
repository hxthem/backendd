





const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/info', isAuthenticated, userController.saveUserInfo);
router.post('/skills', isAuthenticated, userController.addUserSkills);
router.post('/complete-profile', isAuthenticated, userController.completeProfile); 
router.get('/notifications', isAuthenticated, userController.getNotifications);

router.get('/courses', isAuthenticated, userController.getUserCourses);
router.get('/profile/:id', userController.getUserProfile);
router.put('/profile', isAuthenticated, userController.updateUserProfile);

module.exports = router;
