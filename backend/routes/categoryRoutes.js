const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, categoryController.getAllCategories);
router.get('/:id', authenticateToken, categoryController.getCategoryById);
router.post('/', authenticateToken, authorizeRole(['admin']), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole(['admin']), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), categoryController.deleteCategory);

module.exports = router; 