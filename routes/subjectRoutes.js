const express = require('express');
const { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const router = express.Router();
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.post('/', authenticateAdmin, createSubject);
router.put('/:id', authenticateAdmin, updateSubject);
router.delete('/:id', authenticateAdmin, deleteSubject);

module.exports = router;
