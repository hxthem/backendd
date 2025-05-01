const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const authenticate = require('../middleware/authMiddleware'); // تأكد أنه موجود


router.get('/', skillController.searchSkills);
router.post('/', skillController.addSkill);
router.delete('/:skillId', skillController.removeSkill);

module.exports = router;
