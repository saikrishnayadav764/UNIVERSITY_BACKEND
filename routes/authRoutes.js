const express = require('express');
const { loginAdmin, loginStudent, signupStudent, currentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/admin/login', loginAdmin);
router.post('/student/login', loginStudent);
router.post('/student/signup', signupStudent);
router.get('/current-user',authenticateUser, currentUser);

module.exports = router;
