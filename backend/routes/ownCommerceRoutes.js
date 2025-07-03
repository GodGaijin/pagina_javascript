const express = require('express');
const router = express.Router();
const ownCommerceController = require('../controllers/ownCommerceController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, ownCommerceController.getOwnCommerce);
router.put('/', authenticateToken, ownCommerceController.upsertOwnCommerce);

module.exports = router; 