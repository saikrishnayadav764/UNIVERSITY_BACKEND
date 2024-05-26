const express = require('express');
const { getFields, getFieldById, createField, updateField, deleteField } = require('../controllers/fieldController');
const router = express.Router();
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFields);
router.get('/:id', getFieldById);
router.post('/', authenticateAdmin, createField);
router.put('/:id', authenticateAdmin, updateField);
router.delete('/:id', authenticateAdmin, deleteField);

module.exports = router;
