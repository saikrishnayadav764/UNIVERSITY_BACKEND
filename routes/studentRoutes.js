const express = require('express');
const { getStudents, getStudentById, updateStudent, deleteStudent, addOrUpdateMark,getAverageTotalMarks,getSubjectWiseHighestMarks,getTopStudents,getSubjectPassRate, getStudentsCountByField } = require('../controllers/studentController');
const router = express.Router();
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');

router.get('/',authenticateAdmin, getStudents);
router.get('/average-total-marks', getAverageTotalMarks)
router.get('/subjects-highest', getSubjectWiseHighestMarks)
router.get('/count', getStudentsCountByField)
router.get('/top-students/', getTopStudents)
router.get('/passrate', getSubjectPassRate)
router.get('/:id', authenticateUser, getStudentById);
router.put('/:id', authenticateAdmin, updateStudent);
router.delete('/:id', authenticateAdmin, deleteStudent);
router.post('/marks', authenticateAdmin, addOrUpdateMark)



module.exports = router;
